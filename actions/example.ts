
// import action interface
import { Action } from '@dashup/module';

/**
 * build address helper
 */
export default class ExampleAction extends Action {

  /**
   * returns action type
   */
  static get type() {
    // return action type label
    return 'type';
  }

  /**
   * returns action data
   */
  static get data() {
    // return action data
    return {};
  }

  /**
   * returns object of views
   */
  static get views() {
    // return object of views
    return {
      view   : '/path/to/file',
      input  : '/path/to/file',
      config : '/path/to/file',
    };
  }

  /**
   * returns category list for action
   */
  static get categories() {
    // return array of categories
    return ['frontend'];
  }

  /**
   * returns action descripton for list
   */
  static get description() {
    // return description string
    return 'Action Descripton';
  }
}