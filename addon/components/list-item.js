import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';

export default class ListItem extends Component {
  @tracked show_sub_menu = false
  sub_menu_element = null

  @action
  saveElement(element) {
    this.sub_menu_element = element
  }

  @action
  mouseEnter(e) {
    e.stopPropagation();

    if (this.args.item.disabled) {
      return;
    }

    if(!this.sub_menu_element) return
    this.show_sub_menu = true

    let element = e.target
    
    let x = element.offsetWidth - 5;
    let y = element.offsetY;

    // this.sub_menu_element.style.visibility = 'hidden'
    this.sub_menu_element.style.opacity = 0
    this.sub_menu_element.style.left = x + 'px'
    this.sub_menu_element.style.top = y + 'px'

    next(() => {
      let rect = this.sub_menu_element.getBoundingClientRect()
      let right = rect.right
      let bottom = rect.bottom

      if(bottom > window.innerHeight){
        this.sub_menu_element.style.bottom = '0px'
        this.sub_menu_element.style.top = ''
      }
      
      if(right > window.innerWidth){
        this.sub_menu_element.style.left = - this.sub_menu_element.offsetWidth + 'px'
      }
      // this.sub_menu_element.style.visibility = 'visible'
      this.sub_menu_element.style.opacity = 1
    })
    
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
