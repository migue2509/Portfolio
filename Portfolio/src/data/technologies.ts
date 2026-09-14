import htmlIcon from "../assets/technologies/html.png";
import cssIcon from "../assets/technologies/css.png";
import javascriptIcon from "../assets/technologies/javascript.png";
import javaIcon from "../assets/technologies/java.png";
import springBootIcon from "../assets/technologies/spring-boot.png";
import pythonIcon from "../assets/technologies/python.png";
import postgresqlIcon from "../assets/technologies/postgresql.png";
import gitIcon from "../assets/technologies/git.png";
import vscodeIcon from "../assets/technologies/vscode.png";
import intellijIcon from "../assets/technologies/intellij.png";
import figmaIcon from "../assets/technologies/figma.png";
import trelloIcon from "../assets/technologies/trello.png";
import postmanIcon from "../assets/technologies/postman.svg";

export const technologies = {
  html: { name: "HTML", icon: htmlIcon },
  css: { name: "CSS", icon: cssIcon },
  javascript: { name: "JavaScript", icon: javascriptIcon },
  java: { name: "Java", icon: javaIcon },
  springBoot: { name: "Spring Boot", icon: springBootIcon },
  python: { name: "Python", icon: pythonIcon },
  postgresql: { name: "PostgreSQL", icon: postgresqlIcon },
  git: { name: "Git", icon: gitIcon },
  vscode: { name: "VS Code", icon: vscodeIcon },
  intellij: { name: "IntelliJ IDEA", icon: intellijIcon },
  figma: { name: "Figma", icon: figmaIcon },
  trello: { name: "Trello", icon: trelloIcon },
  postman: { name: "Postman", icon: postmanIcon },
} as const;

export type TechnologyId = keyof typeof technologies;
