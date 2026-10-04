#!/usr/bin/env python3
"""Graft tool-summary modules into an existing bundle without dependency churn.

Usage: apply-tool-summary-bundle.py COMPILED_BUNDLE BASE_BUNDLE OUTPUT_BUNDLE
Compile current sources with node build.js first; preserve BASE before building.
"""
from pathlib import Path
import re
import sys

compiled, base, output = map(Path, sys.argv[1:])
generated, original = compiled.read_text(), base.read_text()
prefix = '// server/plugins/fbPostgraphileToApolloPlugin/toolSummariesPlugin/'
wrapper = prefix + 'fbToolSummariesWrapResolverPlugin.js'
helper = prefix + 'batchedToolSummaries.js'
end = prefix + 'index.js'
assert generated.count(helper) == original.count(wrapper) == 1
start = original.index(helper) if helper in original else original.index(wrapper)
stop = original.index(end, start)
replacement = generated[generated.index(helper):generated.index(end, generated.index(helper))]
# esbuild numbers require symbols according to dependency traversal. Resolve the
# graphile-utils import against the target bundle, not the local dependency tree.
pattern = r'var import_graphile_utils = __toModule\((require_\w+)\(\)\)'
reference = re.search(pattern, original[original.index(wrapper):stop]).group(1)
replacement, count = re.subn(pattern, lambda _: 'var import_graphile_utils = __toModule('+reference+'())', replacement)
assert count == 1
output.write_text(original[:start]+replacement+original[stop:])
