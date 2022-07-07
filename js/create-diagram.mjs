export default input => {
  const lines = splitInputIntoLines(input);

  const table = document.createElement("table");
  table.className = "jake-diagram";

  const tHead = table.appendChild(document.createElement("thead"));
  const headRow = tHead.appendChild(document.createElement("tr"));
  headRow.appendChild(document.createElement("td"));

  const tBody = table.appendChild(document.createElement("tbody"));

  let maxStep = 0;
  let currentDoc = 0;
  let docSignifiersToDocIndices = new Map();

  let i = 0;
  while (i < lines.length) {
    const frameName = lines[i];
    const tr = tBody.appendChild(document.createElement("tr"));
    const th = tr.appendChild(document.createElement("th"));
    th.appendChild(document.createElement("code")).textContent = frameName;

    ++i;
    while (lines[i]?.startsWith(" ")) {
      const [, steps, url, docSignifier] = /^\s+([\d-]+): (.+?)(?: | (.+))?$/.exec(lines[i]);

      let docIndex = currentDoc;
      if (docSignifier) {
        if (docSignifiersToDocIndices.has(docSignifier)) {
          docIndex = docSignifiersToDocIndices.get(docSignifier);
        } else {
          docSignifiersToDocIndices.set(docSignifier, docIndex);
          ++currentDoc;
        }
      } else {
        ++currentDoc;
      }

      let startingStep = steps;
      let endingStep = steps;
      if (steps.includes("-")) {
        [, startingStep, endingStep] = /^(\d+)-(\d+)$/.exec(steps);
      }
      maxStep = Math.max(maxStep, endingStep);

      const td = tr.appendChild(document.createElement("td"));
      td.colSpan = endingStep - startingStep  + 1;
      td.className = `doc-${docIndex}`;
      td.textContent = url;

      ++i;
    }
  }

  for (let i = 0; i <= maxStep; ++i) {
    const th = headRow.appendChild(document.createElement("th"));
    th.className = "step";
    th.textContent = i;
  }

  return table;
};

function splitInputIntoLines(input) {
  const [, leadingWhitespace] = /^(\s*)/.exec(input);
  return input
    .split("\n")
    .map(l => l.substring(leadingWhitespace.length))
    .filter(l => l.length > 0);
}