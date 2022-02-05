// import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { next } from '@ember/runloop';

export default class RightClickMenuComponent extends Component {
  @service rightClickMenu;

  @tracked show = false

  // popperId = guidFor(this);

  // generateGetBoundingClientRect(x = 0, y = 0) {
  //   return () => ({
  //     width: 0,
  //     height: 0,
  //     top: y,
  //     right: x,
  //     bottom: y,
  //     left: x,
  //   });
  // }

  // @action
  // getTargetElement(popperId) {
  //   let tetherElement = document.querySelector(`#tether-for-${popperId}`);
  //   let targetElement = tetherElement && tetherElement.parentElement;

  //   if (targetElement) {
  //     tetherElement.remove();
  //     this.targetElement = targetElement;
  //     return targetElement;
  //   }
  // }

  @action
  addContextMenuListeners(element) {
    window.addEventListener('click', this.closeContextMenu);
    window.addEventListener('contextmenu', this.closeContextMenu);

    // console.log('addContextMenuListeners', element, element.parentElement)
    this.triggerElement = element.parentElement
    this.triggerElement.addEventListener(
      'contextmenu',
      this.contextMenu
    );

    // this.getTargetElement(this.popperId).addEventListener(
    //   'contextmenu',
    //   this.contextMenu
    // );
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
    console.log('contextMenu')
    e.preventDefault();
    this.show = true
    // let popperElementId = `popper-for-${this.popperId}`;

    // let { clientX: x, clientY: y } = e;
    let { pageX: x, pageY: y } = e;
    // console.log(x, y, this.element, this.element.offsetHeight)

    this.element.style.left = x + 'px'
    this.element.style.top = y + 'px'

    next(() => {
      if((y + this.element.offsetHeight) > window.innerHeight){
        this.element.style.top = (y - this.element.offsetHeight) + 'px'
      }

      if((x + this.element.offsetWidth) > window.innerWidth){
        this.element.style.left = (x - this.element.offsetWidth) + 'px'
      }
    })

    

    // let virtualElement = {
    //   getBoundingClientRect: () => {
    //     return {
    //       width: 0,
    //       height: 0,
    //       top: y,
    //       right: x + 10,
    //       bottom: y,
    //       left: x,
    //     };
    //   },
    // };

    // this.rightClickMenu.createPopper(
    //   popperElementId,
    //   this.targetElement,
    //   virtualElement
    // );
  }

  @action
  closeContextMenu(e) {
    // console.log('closeContextMenu', this.element, e.target)
    if (this.triggerElement.contains(e.target)) return

    if (
      e &&
      e.target.nodeName === 'LI' &&
      !e.path.every((element) => {

        return (
          !element.className ||
          !element.className.includes('ember-right-click-menu__item')
        );
      })
    ) {
      return;
    }

    if (!e || e.type === 'click' || !e.path.includes(this.targetElement)) {
      this.show = false
      // this.rightClickMenu.closePopper(this.targetElement);
    }
  }
}
