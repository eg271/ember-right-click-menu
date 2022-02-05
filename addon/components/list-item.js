// import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';

export default class ListItem extends Component {
  // @service rightClickMenu;

  // popperId = guidFor(this);
  @tracked show_sub_menu = false
  sub_menu_element = null

  @action
  saveElement(element) {
    // console.log('saveElement', element)
    this.sub_menu_element = element
  }

  @action
  mouseEnter(e) {
    e.stopPropagation();

    if (this.args.item.disabled) {
      return;
    }

    // console.log('this.sub_menu_element', this.sub_menu_element)
    if(!this.sub_menu_element) return
    this.show_sub_menu = true

    let element = e.target
    
    let x = element.offsetWidth - 5;
    let y = element.offsetY;
    // console.log('element', rect.left, element.offsetWidth)

    this.sub_menu_element.style.left = x + 'px'
    this.sub_menu_element.style.top = y + 'px'

    // let rect = e.target.getBoundingClientRect()
    // console.log('rect', rect.right, this.sub_menu_element.offsetWidth)
    // let right = rect.right + this.sub_menu_element.offsetWidth
    // let bottom = rect.bottom + this.sub_menu_element.offsetHeight
    next(() => {
      let rect = this.sub_menu_element.getBoundingClientRect()
      let right = rect.right
      let bottom = rect.bottom
      // console.log('next', right)

      // console.log(y, this.element.offsetHeight, window.innerHeight)
      if(bottom > window.innerHeight){
        this.sub_menu_element.style.bottom = '0px'
        this.sub_menu_element.style.top = ''
      }
      
      // console.log('right', right, window.innerWidth)
      if(right > window.innerWidth){
        this.sub_menu_element.style.left = - this.sub_menu_element.offsetWidth + 'px'
        // this.sub_menu_element.style.left = ''
        // this.sub_menu_element.style.left = (x - this.sub_menu_element.offsetWidth) + 'px'
      }
    })
    
    // this.rightClickMenu.createPopper(`popper-for-${this.popperId}`);
  }

  @action
  mouseLeave(e){
    this.show_sub_menu = false
  }

  @action
  triggerAction(e) {
    if (this.args.item.disabled) {
      return;
    }

    if (this.args.item.action) {
      const args = this.args.item.args || []
      this.args.item.action(...args, e);
    }

    if (!this.args.item.items) {
      this.args.closeContextMenu();
    }
  }
}
