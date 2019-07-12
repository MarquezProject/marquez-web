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
    var subjectId = subject + ":,:" + subjectType;
    var objectId = object + ":,:" + objectType;
    if (!stored.has(subjectId)) {
      var subjectNode = {
        id: subjectId,
        label: subject,
        borderWidth: subjectId === name ? 3 : 1,
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
      stored.add(subjectId);
    }
    if (!stored.has(objectId)) {
      var objectNode = {
        id: objectId,
        label: object,
        borderWidth: objectId === name ? 3 : 1,
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
      stored.add(objectId);
    }
    if (subjectType === "job") {
      if (jobs.includes(subjectId)) {
        jobEntrySubject = jobMap.get(subjectId);
        jobEntrySubject.output.push(objectId);
        jobMap.set(subjectId, jobEntrySubject);
      } else {
        jobMap.set(subjectId, {
          jobId: subjectId,
          input: [],
          output: [objectId]
        });
        jobs.push(subjectId);
      }
    } else {
      if (jobs.includes(objectId)) {
        jobEntryObject = jobMap.get(objectId);
        jobEntryObject.input.push(subjectId);
        jobMap.set(objectId, jobEntryObject);
      } else {
        jobMap.set(objectId, {
          jobId: objectId,
          input: [subjectId],
          output: []
        });
        jobs.push(objectId);
      }
    }
    if (subjectType === "dataset") {
      if (datasets.includes(subjectId)) {
        datasetEntrySubject = datasetMap.get(subjectId);
        datasetEntrySubject.outputJob.push(objectId);
        datasetMap.set(subjectId, datasetEntrySubject);
      } else {
        datasetMap.set(subjectId, {
          datasetId: subjectId,
          inputJob: [],
          outputJob: [objectId]
        });
        datasets.push(subjectId);
      }
    } else {
      if (datasets.includes(objectId)) {
        datasetEntryObject = datasetMap.get(objectId);
        datasetEntryObject.inputJob.push(subjectId);
        datasetMap.set(objectId, datasetEntryObject);
      } else {
        datasetMap.set(objectId, {
          datasetId: objectId,
          inputJob: [subjectId],
          outputJob: []
        });
        datasets.push(objectId);
      }
    }

    graph.edges.push({ from: subjectId, to: objectId });
    return null;
  });

  switch (graphType) {
    case "Jobs":
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
      graphNoDatasets.edges.sort();
      graphNoDatasets.nodes.sort();
      return graphNoDatasets;
    case "Datasets":
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
      graphNoJobs.edges.sort();
      graphNoJobs.nodes.sort();
      return graphNoJobs;
    case "Jobs and Datasets":
      graph.edges.sort();
      graph.nodes.sort();
      return graph;
    case "simpleGraph":
      return buildSimpleGraph(graph, name);
    default:
      graph.edges.sort();
      graph.nodes.sort();
      return graph;
  }
}

function buildSimpleGraph(graph, nodeName) {
  var sGraph = { nodes: [], edges: [] };
  var adjList = buildAdjList(graph);
  var parentGraph = BFSgetAll(graph, adjList, "parents", nodeName);
  var childrenGraph = BFSgetAll(graph, adjList, "children", nodeName);
  parentGraph.nodes.map(node => sGraph.nodes.push(node));
  parentGraph.edges.map(edge => sGraph.edges.push(edge));
  var filteredChildrenGraphNodes = childrenGraph.nodes.filter(
    node => !parentGraph.nodes.includes(node)
  );
  var filteredChildrenGraphEdges = childrenGraph.edges.filter(
    edge => !parentGraph.edges.includes(edge)
  );
  filteredChildrenGraphNodes.map(node => sGraph.nodes.push(node));
  filteredChildrenGraphEdges.map(edge => sGraph.edges.push(edge));
  return sGraph;
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
  return BFSgetAll(graph, adjList, relative, datasetName);
}

function BFSgetAll(graph, adjList, relative, datasetName) {
  var nodeList = graph.nodes.map(node => node.id);
  console.log(nodeList);
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
  var path = BFSfindPath(adjList, origin, dest, "parents");
  if (path.length === 0) {
    path = BFSfindPath(adjList, origin, dest, "children");
  }
  fGraph.nodes = graph.nodes.filter(node => path.includes(node.id)).sort();
  fGraph.edges = graph.edges
    .filter(edge => path.includes(edge.to) && path.includes(edge.from))
    .sort();
  return fGraph;
}

function BFSfindPath(adjList, origin, dest, relative) {
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
