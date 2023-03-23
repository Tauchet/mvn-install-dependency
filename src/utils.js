import AdmZip from 'adm-zip'
import YAML from 'yaml'

export function exit({ code = 0 }) {
    process.exit(code);
}

export function extractInitialData(pathname) {

    if (!pathname.endsWith(".jar")) {
        return {};
    }

    const data = { packaging: "jar" };
    const zip = new AdmZip(pathname);
    const pluginYml = zip.getEntry("plugin.yml");
    if (pluginYml == null) {
        return data;
    }

    const pluginYaml = YAML.parse(pluginYml.getData().toString('utf-8'), {uniqueKeys: false});
    data.groupId = (pluginYaml.main || "").split("\.").filter(x => x.toLowerCase() == x).join(".");
    data.artifactId = pluginYaml.name || null;
    data.version = pluginYaml.version || null;

    return data;
}