export function saveSelection(): Range[] | undefined {
	const sel = window.getSelection();
	if (sel?.getRangeAt && sel.rangeCount) {
		var ranges: Range[] = [];
		for (var i = 0, len = sel.rangeCount; i < len; ++i) {
			ranges.push(sel.getRangeAt(i));
		}
		return ranges;
	}
	return undefined;
}

export function restoreSelection(savedSel: Range[] | undefined) {
	const sel = window.getSelection();

	if (savedSel && sel) {
		sel.removeAllRanges();
		for (var i = 0, len = savedSel.length; i < len; ++i) {
			sel.addRange(savedSel[i]);
		}
	}
}