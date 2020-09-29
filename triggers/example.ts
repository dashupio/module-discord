
// import trigger interface
import { Trigger } from '@dashup/module';

/**
 * build address helper
 */
export default class ExampleTrigger extends Trigger {

  /**
   * returns trigger type
   */
  static get type() {
    // return trigger type label
    return 'type';
  }

  /**
   * returns trigger data
   */
  static get data() {
    // return trigger data
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
   * returns category list for trigger
   */
  static get categories() {
    // return array of categories
    return ['frontend'];
  }

  /**
   * returns trigger descripton for list
   */
  static get description() {
    // return description string
    return 'Trigger Descripton';
  }
}