// Component Spotter — lists every component used on a chosen page.

figma.showUI(__html__, { width: 380, height: 560, themeColors: true });

function sendPages() {
  figma.ui.postMessage({
    type: 'pages',
    pages: figma.root.children.map((p) => ({ id: p.id, name: p.name })),
    currentPageId: figma.currentPage.id,
  });
}

function hasInstanceAncestor(node) {
  let p = node.parent;
  while (p && p.type !== 'PAGE') {
    if (p.type === 'INSTANCE') return true;
    p = p.parent;
  }
  return false;
}

async function scan(pageId, includeNested) {
  if (pageId === '__current__') pageId = figma.currentPage.id;
  const page = await figma.getNodeByIdAsync(pageId);
  if (!page || page.type !== 'PAGE') {
    figma.ui.postMessage({ type: 'error', message: 'Page not found.' });
    return;
  }
  await page.loadAsync();

  let instances = page.findAllWithCriteria({ types: ['INSTANCE'] });
  if (!includeNested) instances = instances.filter((n) => !hasInstanceAncestor(n));

  // Grouped by component set (or standalone component).
  const groups = new Map();
  const total = instances.length;

  for (let i = 0; i < total; i++) {
    const inst = instances[i];
    const main = await inst.getMainComponentAsync();

    let key, name, kind, remote, variantName;
    if (!main) {
      key = '__missing__';
      name = 'Missing component';
      kind = 'missing';
      remote = false;
      variantName = null;
    } else if (main.parent && main.parent.type === 'COMPONENT_SET') {
      const set = main.parent;
      key = set.id;
      name = set.name;
      kind = 'set';
      remote = set.remote;
      variantName = main.name;
    } else {
      key = main.id;
      name = main.name;
      kind = 'component';
      remote = main.remote;
      variantName = null;
    }

    let g = groups.get(key);
    if (!g) {
      g = { key, name, kind, remote, mainId: main ? (kind === 'set' ? main.parent.id : main.id) : null, instanceIds: [], variants: {} };
      groups.set(key, g);
    }
    g.instanceIds.push(inst.id);
    if (variantName) {
      if (!g.variants[variantName]) g.variants[variantName] = [];
      g.variants[variantName].push(inst.id);
    }

    if (i % 200 === 0) figma.ui.postMessage({ type: 'progress', done: i, total });
  }

  const components = [...groups.values()]
    .map((g) =>
      Object.assign({}, g, {
        count: g.instanceIds.length,
        variants: Object.entries(g.variants)
          .map(([name, ids]) => ({ name, ids, count: ids.length }))
          .sort((a, b) => b.count - a.count),
      })
    )
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  figma.ui.postMessage({
    type: 'result',
    pageId,
    pageName: page.name,
    totalInstances: total,
    components,
  });
}

async function selectNodes(pageId, ids) {
  const page = await figma.getNodeByIdAsync(pageId);
  if (!page || page.type !== 'PAGE') return;
  if (figma.currentPage.id !== page.id) await figma.setCurrentPageAsync(page);
  const nodes = (await Promise.all(ids.map((id) => figma.getNodeByIdAsync(id)))).filter(Boolean);
  figma.currentPage.selection = nodes;
  if (nodes.length) figma.viewport.scrollAndZoomIntoView(nodes);
  figma.notify(`Selected ${nodes.length} instance${nodes.length === 1 ? '' : 's'}`);
}

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'ready' || msg.type === 'refresh-pages') sendPages();
    else if (msg.type === 'scan') await scan(msg.pageId, msg.includeNested);
    else if (msg.type === 'select') await selectNodes(msg.pageId, msg.ids);
    else if (msg.type === 'resize') figma.ui.resize(msg.width, msg.height);
  } catch (e) {
    figma.ui.postMessage({ type: 'error', message: String(e && e.message ? e.message : e) });
  }
};

figma.on('currentpagechange', sendPages);
