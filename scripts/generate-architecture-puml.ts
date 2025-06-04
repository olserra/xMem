import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');
const OUTPUT_PATH = path.join(__dirname, '../docs/architecture.puml');

function scanDirForModules(dir: string, parent: string = ''): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let modules: string[] = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      modules = modules.concat(scanDirForModules(path.join(dir, entry.name), entry.name));
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      const name = parent ? `${parent}/${entry.name}` : entry.name;
      modules.push(name.replace(/\.(ts|tsx)$/, ''));
    }
  }
  return modules;
}

const modules = scanDirForModules(SRC_DIR);

const containers = modules.map(m => `  Container(xmem_${m.replace(/\W/g, '_')}, "${m}", "module")`).join('\n');

const puml = `@startuml C4-Container
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(admin, "Admin")
Person(developer, "Developer")
Person(user, "End User")
System_Boundary(xmem, "xmem System") {
${containers}
}

Rel(admin, xmem, "manages")
Rel(developer, xmem, "develops")
Rel(user, xmem, "uses")

@enduml
`;

fs.writeFileSync(OUTPUT_PATH, puml, 'utf8');
console.log(`Generated PlantUML C4 diagram at ${OUTPUT_PATH}`); 