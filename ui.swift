// ui.swift — native macOS front-end for chrome-to-safari.sh
// Compiled on first run by `./chrome-to-safari.sh --ui` (swiftc, no Xcode project).
// The shell script stays the single source of truth; this window just runs it
// and shows its output.
//
// Tabs:
//   Extensions — every entry under <repo>/extensions/: install, check updates.
//   Add        — vendor a new extension from a store URL or unpacked folder.

import SwiftUI
import UniformTypeIdentifiers

enum AppTab: String, CaseIterable, Identifiable {
    case extensions = "Extensions"
    case add = "Add"

    var id: String { rawValue }
}

struct Step: Identifiable {
    let id = UUID()
    let label: String
    var done = false
}

struct ExtensionEntry: Identifiable {
    let id: String          // slug
    let appName: String
    let version: String
    let origin: String      // "local" | "store"
    let hasOverlay: Bool
    let installed: Bool
}

final class Runner: ObservableObject {
    static let scriptPath = ProcessInfo.processInfo.environment["C2S_SCRIPT"]
        ?? FileManager.default.currentDirectoryPath + "/chrome-to-safari.sh"

    static var repoRoot: String {
        URL(fileURLWithPath: scriptPath).deletingLastPathComponent().path
    }

    static var extensionsDir: String {
        repoRoot + "/extensions"
    }

    @Published var steps: [Step] = []
    @Published var log = ""
    @Published var running = false
    @Published var finished = false
    @Published var succeeded = false
    @Published var lastVerb = ""

    func run(arguments: [String], env: [String: String] = [:]) {
        steps = []
        log = ""
        finished = false
        succeeded = false
        running = true
        lastVerb = arguments.first ?? ""

        let proc = Process()
        proc.executableURL = URL(fileURLWithPath: "/bin/bash")
        proc.arguments = [Self.scriptPath] + arguments
        var environment = ProcessInfo.processInfo.environment
        for (key, value) in env where !value.trimmingCharacters(in: .whitespaces).isEmpty {
            environment[key] = value
        }
        proc.environment = environment
        let pipe = Pipe()
        proc.standardOutput = pipe
        proc.standardError = pipe

        pipe.fileHandleForReading.readabilityHandler = { [weak self] handle in
            let data = handle.availableData
            guard !data.isEmpty else { return }
            let text = String(decoding: data, as: UTF8.self)
            DispatchQueue.main.async { self?.append(text) }
        }
        proc.terminationHandler = { [weak self] p in
            // let the read handler deliver the last chunk (the error message) before closing
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                guard let self else { return }
                pipe.fileHandleForReading.readabilityHandler = nil
                for i in self.steps.indices { self.steps[i].done = true }
                self.running = false
                self.finished = true
                self.succeeded = p.terminationStatus == 0
            }
        }

        do {
            try proc.run()
        } catch {
            append("ERROR: could not run \(Self.scriptPath): \(error.localizedDescription)\n")
            running = false
            finished = true
        }
    }

    private func append(_ text: String) {
        log += text
        for line in text.split(separator: "\n") where line.hasPrefix("==> ") {
            for i in steps.indices { steps[i].done = true }
            steps.append(Step(label: String(line.dropFirst(4))))
        }
    }
}

struct ContentView: View {
    @StateObject private var runner = Runner()
    @State private var tab: AppTab = .extensions

    // Add tab state
    @State private var input = ""
    @State private var dropTargeted = false
    @State private var newAppName = ""
    @State private var newBundleID = ""

    // Options
    @State private var showOptions = false
    @State private var teamID = ""

    @State private var showLog = false
    @State private var entries: [ExtensionEntry] = []

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Picker("Tab", selection: $tab) {
                ForEach(AppTab.allCases) { t in
                    Text(t.rawValue).tag(t)
                }
            }
            .pickerStyle(.segmented)
            .disabled(runner.running)

            switch tab {
            case .extensions: extensionsPane
            case .add: addPane
            }

            VStack(spacing: 12) {
                Button(action: primaryAction) {
                    HStack(spacing: 8) {
                        if runner.running {
                            ProgressView().controlSize(.small)
                        }
                        Text(runner.running ? runningLabel : primaryLabel)
                            .fontWeight(.medium)
                    }
                    .frame(maxWidth: .infinity)
                }
                .controlSize(.large)
                .buttonStyle(.borderedProminent)
                .keyboardShortcut(.defaultAction)
                .disabled(!primaryEnabled)
            }

            optionsDisclosure

            if !runner.steps.isEmpty {
                stepsBox
            }

            if runner.finished {
                resultBanner
            }

            logDisclosure
        }
        .padding(20)
        .frame(width: 540)
        .animation(.easeOut(duration: 0.2), value: runner.steps.count)
        .animation(.easeOut(duration: 0.2), value: runner.finished)
        .onChange(of: runner.finished) { _, done in
            if done { refreshEntries() }
        }
        .onAppear {
            NSApp.setActivationPolicy(.regular)
            NSApp.activate(ignoringOtherApps: true)
            refreshEntries()
        }
    }

    // MARK: - Extensions tab

    private var extensionsPane: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("extensions/")
                    .font(.callout)
                    .foregroundStyle(.secondary)
                Spacer()
                Button("Refresh") { refreshEntries() }
                    .disabled(runner.running)
                Button("Install All") { runner.run(arguments: ["install", "all"]) }
                    .disabled(runner.running || entries.isEmpty)
            }
            .font(.callout)

            if entries.isEmpty {
                VStack(spacing: 6) {
                    Text("No extensions yet.")
                        .font(.callout.weight(.medium))
                    Text("Use the Add tab: paste a Chrome Web Store link or drop an unpacked folder.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 24)
            } else {
                ScrollView {
                    VStack(spacing: 4) {
                        ForEach(entries) { entry in
                            extensionRow(entry)
                        }
                    }
                }
                .frame(maxHeight: 240)
            }
        }
    }

    private func extensionRow(_ entry: ExtensionEntry) -> some View {
        HStack(spacing: 10) {
            Image(systemName: entry.installed ? "puzzlepiece.extension.fill" : "puzzlepiece.extension")
                .foregroundStyle(entry.installed ? Color.green : Color.secondary)
            VStack(alignment: .leading, spacing: 1) {
                HStack(spacing: 6) {
                    Text(entry.appName)
                        .font(.callout.weight(.medium))
                    Text("v\(entry.version)")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    if entry.hasOverlay {
                        Text("safari overlay")
                            .font(.caption2)
                            .padding(.horizontal, 4)
                            .padding(.vertical, 1)
                            .background(Color.accentColor.opacity(0.15),
                                        in: Capsule())
                    }
                    if entry.origin == "store" {
                        Image(systemName: "arrow.triangle.branch")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                            .help("forked from the Chrome Web Store — updates available via rebase")
                    }
                }
                Text("\(entry.id) · \(entry.installed ? "installed" : "not installed")")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }
            Spacer()
            Button("Check") {
                runner.run(arguments: ["update", "--check", entry.id])
            }
            .disabled(runner.running || entry.origin != "store")
            .help(entry.origin == "store"
                  ? "Look up the upstream version and diff"
                  : "Local extension — no upstream to check")
            Button("Install") {
                runner.run(arguments: ["install", entry.id])
            }
            .disabled(runner.running)
            .buttonStyle(.bordered)
        }
        .padding(8)
        .background(.quinary, in: RoundedRectangle(cornerRadius: 8))
        .contentShape(Rectangle())
    }

    // MARK: - Add tab

    private var addPane: some View {
        VStack(alignment: .leading, spacing: 12) {
            dropZone

            VStack(spacing: 10) {
                HStack(spacing: 8) {
                    Image(systemName: "link")
                        .foregroundStyle(.secondary)
                    TextField("Store link or folder path", text: $input)
                        .textFieldStyle(.roundedBorder)
                        .disabled(runner.running)
                }

                Grid(alignment: .leadingFirstTextBaseline, horizontalSpacing: 8, verticalSpacing: 8) {
                    GridRow {
                        Text("App Name")
                            .foregroundStyle(.secondary)
                            .gridColumnAlignment(.trailing)
                        TextField("from the manifest", text: $newAppName)
                            .textFieldStyle(.roundedBorder)
                    }
                    GridRow {
                        Text("Bundle ID")
                            .foregroundStyle(.secondary)
                            .gridColumnAlignment(.trailing)
                        TextField("com.converted.<slug>", text: $newBundleID)
                            .textFieldStyle(.roundedBorder)
                    }
                }
                .font(.callout)

                Text("The source is vendored into extensions/<slug>/src as an anchor commit; your edits go on top as normal commits.")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .onDrop(of: [.fileURL], isTargeted: $dropTargeted) { providers in
            guard let provider = providers.first else { return false }
            _ = provider.loadObject(ofClass: URL.self) { url, _ in
                if let url {
                    DispatchQueue.main.async {
                        input = url.path
                        tab = .add
                    }
                }
            }
            return true
        }
    }

    private var dropZone: some View {
        VStack(spacing: 8) {
            Image(systemName: "puzzlepiece.extension")
                .font(.system(size: 30, weight: .light))
                .foregroundStyle(dropTargeted ? Color.accentColor : Color.secondary)
            Text("Drop an unpacked extension folder here, or click to choose one")
                .font(.callout.weight(.medium))
            Text("or paste a Chrome Web Store link below")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 26)
        .background(
            RoundedRectangle(cornerRadius: 10)
                .fill(dropTargeted ? Color.accentColor.opacity(0.08) : Color.clear)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .strokeBorder(dropTargeted ? Color.accentColor : Color(nsColor: .separatorColor),
                              style: StrokeStyle(lineWidth: dropTargeted ? 2 : 1, dash: [5, 4]))
        )
        .contentShape(Rectangle())
        .onTapGesture { if !runner.running { chooseFolder() } }
        .animation(.easeOut(duration: 0.15), value: dropTargeted)
    }

    // MARK: - Shared chrome

    private var optionsDisclosure: some View {
        DisclosureGroup("Options", isExpanded: $showOptions) {
            Text("Leave any field blank to use its default.")
                .font(.caption)
                .foregroundStyle(.secondary)
                .padding(.top, 10)

            Grid(alignment: .leadingFirstTextBaseline, horizontalSpacing: 8, verticalSpacing: 8) {
                GridRow {
                    Text("Team ID")
                        .gridColumnAlignment(.trailing)
                        .foregroundStyle(.secondary)
                    TextField("auto-detected from your keychain", text: $teamID)
                        .textFieldStyle(.roundedBorder)
                }
            }
            .font(.callout)
            .disabled(runner.running)
        }
        .font(.callout)
    }

    private var stepsBox: some View {
        VStack(alignment: .leading, spacing: 10) {
            ForEach(runner.steps) { step in
                HStack(spacing: 8) {
                    if step.done {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundStyle(.green)
                    } else if runner.finished && !runner.succeeded {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundStyle(.red)
                    } else {
                        ProgressView()
                            .controlSize(.small)
                    }
                    Text(step.label)
                        .font(.callout)
                        .foregroundStyle(step.done ? .secondary : .primary)
                }
                .transition(.opacity)
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.quinary, in: RoundedRectangle(cornerRadius: 8))
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .strokeBorder(Color(nsColor: .separatorColor))
        )
    }

    private var resultBanner: some View {
        let ok = runner.succeeded
        return HStack(spacing: 10) {
            Image(systemName: ok ? "checkmark.seal.fill" : "exclamationmark.triangle.fill")
                .foregroundStyle(ok ? Color.green : Color.red)
            Text(ok ? successMessage : "Failed. See the log below for details.")
                .font(.callout.weight(.medium))
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background((ok ? Color.green : Color.red).opacity(0.08),
                    in: RoundedRectangle(cornerRadius: 8))
        .onAppear { if !ok { showLog = true } }
    }

    private var successMessage: String {
        switch runner.lastVerb {
        case "add":
            return "Added and installed. Enable it in Safari → Settings → Extensions."
        case "install":
            return "Installed. Enable it in Safari → Settings → Extensions."
        case "update":
            return "Update applied and installed."
        default:
            return "Done."
        }
    }

    private var logDisclosure: some View {
        DisclosureGroup("Log", isExpanded: $showLog) {
            ScrollViewReader { proxy in
                ScrollView {
                    Text(runner.log.isEmpty ? "No output yet." : runner.log)
                        .font(.caption.monospaced())
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .textSelection(.enabled)
                        .padding(8)
                    Color.clear.frame(height: 1).id("end")
                }
                .frame(height: 170)
                .background(.quinary, in: RoundedRectangle(cornerRadius: 8))
                .onChange(of: runner.log) { _, _ in proxy.scrollTo("end") }
                .padding(.top, 8)
            }
        }
        .font(.callout)
    }

    // MARK: - Actions

    private var primaryEnabled: Bool {
        guard !runner.running else { return false }
        switch tab {
        case .add: return !input.trimmingCharacters(in: .whitespaces).isEmpty
        case .extensions: return !entries.isEmpty
        }
    }

    private var primaryLabel: String {
        switch tab {
        case .add: return "Add & Install"
        case .extensions: return "Check All Updates"
        }
    }

    private var runningLabel: String {
        switch tab {
        case .add: return "Adding…"
        case .extensions: return "Checking…"
        }
    }

    private func primaryAction() {
        let team = ["TEAM_ID": teamID]
        switch tab {
        case .add:
            var args = ["add", input.trimmingCharacters(in: .whitespaces)]
            let name = newAppName.trimmingCharacters(in: .whitespaces)
            let bundle = newBundleID.trimmingCharacters(in: .whitespaces)
            if !name.isEmpty { args += ["--name", name] }
            if !bundle.isEmpty { args += ["--bundle-id", bundle] }
            runner.run(arguments: args, env: team)
        case .extensions:
            runner.run(arguments: ["update", "--check", "all"], env: team)
        }
    }

    private func refreshEntries() {
        entries = Self.scanExtensions()
    }

    static func scanExtensions() -> [ExtensionEntry] {
        let fm = FileManager.default
        let root = URL(fileURLWithPath: Runner.extensionsDir)
        guard let slugs = try? fm.contentsOfDirectory(atPath: root.path) else { return [] }
        var result: [ExtensionEntry] = []
        for slug in slugs.sorted() {
            let dir = root.appendingPathComponent(slug)
            let metaPath = dir.appendingPathComponent("meta.json").path
            guard fm.fileExists(atPath: metaPath),
                  let data = fm.contents(atPath: metaPath),
                  let meta = try? JSONSerialization.jsonObject(with: data) as? [String: Any]
            else { continue }

            let appName = meta["app_name"] as? String ?? slug
            let version = (meta["upstream_version"] as? String) ?? "-"
            let origin = meta["origin"] as? String ?? "local"

            let safariDir = dir.appendingPathComponent("safari")
            var hasOverlay = false
            if let items = try? fm.contentsOfDirectory(atPath: safariDir.path) {
                hasOverlay = items.contains { $0 != ".gitkeep" && !$0.hasPrefix(".") }
            }

            let appPath = "/Applications/\(appName).app"
            let installed = fm.fileExists(atPath: appPath)

            result.append(ExtensionEntry(id: slug,
                                         appName: appName,
                                         version: version.isEmpty ? "-" : version,
                                         origin: origin,
                                         hasOverlay: hasOverlay,
                                         installed: installed))
        }
        return result
    }

    private func chooseFolder() {
        let panel = NSOpenPanel()
        panel.canChooseDirectories = true
        panel.canChooseFiles = false
        panel.message = "Pick the unpacked extension folder (the one containing manifest.json)"
        if panel.runModal() == .OK, let url = panel.url {
            input = url.path
        }
    }
}

@main
struct ChromeToSafariApp: App {
    var body: some Scene {
        WindowGroup("Chrome to Safari") {
            ContentView()
        }
        .windowResizability(.contentSize)
    }
}
