import { Injectable } from '@angular/core';
import tippy, { Instance, Props, followCursor } from 'tippy.js';

@Injectable()
export class TippyService {
  tooltip: Instance<Props>;
  constructor() { }
  public showTooltip(content: string): Instance<Props> {
    if (this.tooltip) {
      this.tooltip.hide();
      this.tooltip.destroy();
    }
    const htmlContent = "<span class=\"tooltip-text\">"+content+"</span>";
    this.tooltip = tippy(document.body, { ...this.getStyle(), content: htmlContent, trigger: "manual", appendTo: () => document.body, followCursor: "initial", plugins: [followCursor] }) as unknown as Instance<Props>;
    return this.tooltip;
  }
  public setTooltipOnElement(target: Element, content: string) {    
    const htmlContent = "<span class=\"tooltip-text\">"+content+"</span>";
    tippy(target, { content: htmlContent, followCursor: "initial", plugins: [followCursor], ...this.getStyle() })
  }
  public getStyle(): Partial<Props> {
    return { allowHTML: true, arrow: true, placement: "top-start", theme: "report-tooltip" };
  }
}
