import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { next } from '@ember/runloop';

export default class RightClickMenuComponent extends Component {
  @tracked show = false

  @action
  addContextMenuListeners(element) {
    window.addEventListener('click', this.closeContextMenu);
    window.addEventListener('contextmenu', this.closeContextMenu);

    this.triggerElement = element.parentElement
    this.triggerElement.addEventListener(
      'contextmenu',
      this.contextMenu
    );
  }

  @action
  saveElement(element) {
    this.element = element
  }

  @action
  willDestroy() {
    window.removeEventListener('click', this.closeContextMenu);
    window.removeEventListener('contextmenu', this.closeContextMenu);

    if (this.targetElement) {
      this.targetElement.removeEventListener('contextmenu', this.contextMenu);
    }

    super.willDestroy(...arguments);
  }

  @action
  contextMenu(e) {
    e.preventDefault();
    this.show = true

    let { pageX: x, pageY: y } = e;

    // this.element.style.visibility = 'hidden'
    this.element.style.opacity = 0
    this.element.style.left = x + 'px'
    this.element.style.top = y + 'px'

    next(() => {
      if((y + this.element.offsetHeight) > window.innerHeight){
        this.element.style.top = (y - this.element.offsetHeight) + 'px'
      }

      if((x + this.element.offsetWidth) > window.innerWidth){
        this.element.style.left = (x - this.element.offsetWidth) + 'px'
      }
      // this.element.style.visibility = 'visible'
      this.element.style.opacity = 1
    })
  }

  @action
  closeContextMenu(e) {
    if (e && this.triggerElement.contains(e.target)) return
    this.show = false

    // if (
    //   e &&
    //   e.target.nodeName === 'LI' &&
    //   !e.path.every((element) => {

    //     return (
    //       !element.className ||
    //       !element.className.includes('ember-right-click-menu__item')
    //     );
    //   })
    // ) {
    //   return;
    // }

    // if (!e || e.type === 'click' || !e.path.includes(this.targetElement)) {
    //   this.show = false
    // }
  }
}
