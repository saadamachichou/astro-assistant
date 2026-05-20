import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createWidgetState } from "../src/widgetState.js";

describe("widget state", () => {
  it("starts closed and toggles open", () => {
    const widget = createWidgetState();

    assert.equal(widget.isOpen(), false);

    widget.open();
    assert.equal(widget.isOpen(), true);

    widget.close();
    assert.equal(widget.isOpen(), false);
  });
});
