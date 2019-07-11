export function transformDataToGraph(data, name, graphType, showEdgeLabel) {
  var jobMap = new Map();
  var datasetMap = new Map();
  var datasets = [];
  var stored = new Set();
  var jobs = [];
  var graphNoDatasets = {
    nodes: [],
    edges: []
  };
  var graphNoJobs = {
    nodes: [],
    edges: []
  };
  var graph = {
    nodes: [],
    edges: []
  };
  var jobEntryObject = null;
  var jobEntrySubject = null;
  var datasetEntrySubject = null;
  var datasetEntryObject = null;
  data.map(entry => {
    const { subject, subjectType, object, objectType } = entry;
    if (!stored.has(subject)) {
      var subjectNode = {
        id: subject,
        label: subject,
        borderWidth: subject === name ? 3 : 1,
        title: subjectType,
        color: {
          background: subjectType === "job" ? "orange" : "cyan",
          highlight: {
            border: "black"
          }
        }
      };
      graph.nodes.push(subjectNode);
      if (subjectType !== "job") {
        graphNoJobs.nodes.push(subjectNode);
      }
      if (subjectType !== "dataset") {
        graphNoDatasets.nodes.push(subjectNode);
      }
      stored.add(subject);
    }
    if (!stored.has(object)) {
      var objectNode = {
        id: object,
        label: object,
        borderWidth: object === name ? 3 : 1,
        title: objectType,
        color: {
          background: objectType === "job" ? "orange" : "cyan",
          highlight: {
            border: "black"
          }
        }
      };
      graph.nodes.push(objectNode);
      if (objectType !== "job") {
        graphNoJobs.nodes.push(objectNode);
      }
      if (objectType !== "dataset") {
        graphNoDatasets.nodes.push(objectNode);
      }
      stored.add(object);
    }
    if (subjectType === "job") {
      if (jobs.includes(subject)) {
        jobEntrySubject = jobMap.get(subject);
        jobEntrySubject.output.push(object);
        jobMap.set(subject, jobEntrySubject);
      } else {
        jobMap.set(subject, { jobId: subject, input: [], output: [object] });
        jobs.push(subject);
      }
    } else {
      if (jobs.includes(object)) {
        jobEntryObject = jobMap.get(object);
        jobEntryObject.input.push(subject);
        jobMap.set(object, jobEntryObject);
      } else {
        jobMap.set(object, { jobId: object, input: [subject], output: [] });
        jobs.push(object);
      }
    }
    if (subjectType === "dataset") {
      if (datasets.includes(subject)) {
        datasetEntrySubject = datasetMap.get(subject);
        datasetEntrySubject.outputJob.push(object);
        datasetMap.set(subject, datasetEntrySubject);
      } else {
        datasetMap.set(subject, {
          datasetId: subject,
          inputJob: [],
          outputJob: [object]
        });
        datasets.push(subject);
      }
    } else {
      if (datasets.includes(object)) {
        datasetEntryObject = datasetMap.get(object);
        datasetEntryObject.inputJob.push(subject);
        datasetMap.set(object, datasetEntryObject);
      } else {
        datasetMap.set(object, {
          datasetId: object,
          inputJob: [subject],
          outputJob: []
        });
        datasets.push(object);
      }
    }

    graph.edges.push({ from: subject, to: object });
    return null;
  });
  for (var hh = 0; hh < datasets.length; hh++) {
    var datasetEntry = datasetMap.get(datasets[hh]);
    var { datasetId, inputJob, outputJob } = datasetEntry;
    if (inputJob.length !== 0 && outputJob.length !== 0) {
      for (var i = 0; i < inputJob.length; i++) {
        for (var j = 0; j < outputJob.length; j++) {
          graphNoDatasets.edges.push({
            from: inputJob[i],
            to: outputJob[j],
            label: showEdgeLabel ? datasetId : ""
          });
        }
      }
    }
  }

  for (var ii = 0; ii < jobs.length; ii++) {
    var jobEntry = jobMap.get(jobs[ii]);
    var { jobId, input, output } = jobEntry;
    if (input.length !== 0 && output.length !== 0) {
      for (var jj = 0; jj < input.length; jj++) {
        for (var kk = 0; kk < output.length; kk++) {
          graphNoJobs.edges.push({
            from: input[jj],
            to: output[kk],
            label: showEdgeLabel ? jobId : ""
          });
        }
      }
    }
  }

  switch (graphType) {
    case "Jobs":
      graphNoDatasets.edges.sort();
      graphNoDatasets.nodes.sort();
      return graphNoDatasets;
    case "Datasets":
      graphNoJobs.edges.sort();
      graphNoJobs.nodes.sort();
      return graphNoJobs;
    case "Jobs and Datasets":
      graph.edges.sort();
      graph.nodes.sort();
      return graph;
    default:
      graph.edges.sort();
      graph.nodes.sort();
      return graph;
  }
}

function buildAdjList(graph) {
  var relativesFrom = null;
  var relativesTo = null;
  var adjList = new Map();
  var stored = new Set();
  var { edges } = graph;
  for (var ii = 0; ii < edges.length; ii++) {
    var edge = edges[ii];
    var { from, to } = edge;
    if (!stored.has(from)) {
      adjList.set(from, { name: from, parents: [], children: [to] });
      stored.add(from);
    } else {
      relativesFrom = adjList.get(from);
      relativesFrom.children.push(to);
      adjList.set(from, relativesFrom);
    }
    if (!stored.has(to)) {
      adjList.set(to, { name: to, parents: [from], children: [] });
      stored.add(to);
    } else {
      relativesTo = adjList.get(to);
      relativesTo.parents.push(from);
      adjList.set(to, relativesTo);
    }
  }
  return adjList;
}

export function filterGraph(
  data,
  datasetName,
  relative,
  graphType,
  showEdgeLabel
) {
  var graph = transformDataToGraph(data, datasetName, graphType, showEdgeLabel);
  var adjList = buildAdjList(graph);
  var nodeList = graph.nodes.map(node => node.id);
  var fGraph = {
    nodes: [],
    edges: []
  };
  if (datasetName === null || !nodeList.includes(datasetName)) {
    return fGraph;
  }
  var firstNode = adjList.get(datasetName);
  var coming = [];
  var seen = new Set();
  coming.push(firstNode.name);
  while (coming.length > 0) {
    var nodeName = coming.shift();
    if (!seen.has(nodeName)) {
      seen.add(nodeName);
      var node = adjList.get(nodeName);
      var relatives = relative === "parents" ? node.parents : node.children;
      for (var i = 0; i < relatives.length; i++) {
        coming.push(relatives[i]);
      }
    }
  }
  fGraph.nodes = graph.nodes.filter(node => seen.has(node.id)).sort();
  fGraph.edges = graph.edges
    .filter(edge => seen.has(edge.to) && seen.has(edge.from))
    .sort();
  return fGraph;
}

export function findDirectLineage(
  data,
  origin,
  dest,
  graphType,
  showEdgeLabel
) {
  var graph = transformDataToGraph(data, origin, graphType, showEdgeLabel);
  var adjList = buildAdjList(graph);
  var nodeList = graph.nodes.map(node => node.id);
  var fGraph = {
    nodes: [],
    edges: []
  };
  if (
    origin === null ||
    dest === null ||
    !nodeList.includes(origin) ||
    !nodeList.includes(dest)
  ) {
    return fGraph;
  }
  var path = BFS(adjList, origin, dest, "parents");
  if (path.length === 0) {
    path = BFS(adjList, origin, dest, "children");
  }
  fGraph.nodes = graph.nodes.filter(node => path.includes(node.id)).sort();
  fGraph.edges = graph.edges
    .filter(edge => path.includes(edge.to) && path.includes(edge.from))
    .sort();
  return fGraph;
}

function BFS(adjList, origin, dest, relative) {
  if (origin === dest) {
    return [origin];
  }
  var coming = [];
  var seen = new Set();
  var relativeMap = new Map();
  relativeMap.set(origin, null);
  coming.push(origin);
  while (coming.length > 0) {
    var nodeName = coming.shift();
    if (!seen.has(nodeName)) {
      seen.add(nodeName);
      var node = adjList.get(nodeName);
      var relatives = relative === "parents" ? node.parents : node.children;
      for (var i = 0; i < relatives.length; i++) {
        relativeMap.set(relatives[i], nodeName);
        coming.push(relatives[i]);
        if (relatives[i] === dest) {
          return buildPath(relatives[i], relativeMap);
        }
      }
    }
  }
  return [];
}

function buildPath(origin, relativeMap) {
  var path = [];
  var currNode = origin;
  while (currNode !== null) {
    path.unshift(currNode);
    currNode = relativeMap.get(currNode);
  }
  return path;
}

export function transformDatasetList(datasets) {
  var newDatasets = "";
  if (datasets.length <= 1) {
    return datasets;
  } else {
    for (var ii = 0; ii < datasets.length; ii++) {
      newDatasets += datasets[ii];
      if (ii < datasets.length - 1) {
        newDatasets += ", ";
      }
    }
    return newDatasets;
  }
}
