/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
}

Rectangle.prototype.getArea = function getArea() {
  return this.width * this.height;
};

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = Object.create(proto);
  const data = JSON.parse(json);
  return Object.assign(obj, data);
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssSelector {
  constructor() {
    this.parts = [];
    this.order = ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'];
    this.usedParts = new Set();
  }

  validateOrder(partType) {
    if (this.parts.length > 0) {
      const lastPartType = this.parts[this.parts.length - 1].type;
      const lastIndex = this.order.indexOf(lastPartType);
      const newIndex = this.order.indexOf(partType);

      if (newIndex < lastIndex) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    }

    if (['element', 'id', 'pseudoElement'].includes(partType) && this.usedParts.has(partType)) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    this.usedParts.add(partType);
  }

  element(value) {
    this.validateOrder('element');
    this.parts.push({ type: 'element', value });
    return this;
  }

  id(value) {
    this.validateOrder('id');
    this.parts.push({ type: 'id', value: `#${value}` });
    return this;
  }

  class(value) {
    this.validateOrder('class');
    this.parts.push({ type: 'class', value: `.${value}` });
    return this;
  }

  attr(value) {
    this.validateOrder('attr');
    this.parts.push({ type: 'attr', value: `[${value}]` });
    return this;
  }

  pseudoClass(value) {
    this.validateOrder('pseudoClass');
    this.parts.push({ type: 'pseudoClass', value: `:${value}` });
    return this;
  }

  pseudoElement(value) {
    this.validateOrder('pseudoElement');
    this.parts.push({ type: 'pseudoElement', value: `::${value}` });
    return this;
  }

  static combine(selector1, combinator, selector2) {
    const combined = new CssSelector();
    combined.parts = [{
      type: 'combined',
      value: `${selector1.stringify()} ${combinator} ${selector2.stringify()}`,
    }];
    return combined;
  }

  stringify() {
    if (this.parts.length === 0) return '';

    if (this.parts[0].type === 'combined') {
      return this.parts[0].value;
    }

    return this.parts.map((part) => part.value).join('');
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new CssSelector().element(value);
  },

  id(value) {
    return new CssSelector().id(value);
  },

  class(value) {
    return new CssSelector().class(value);
  },

  attr(value) {
    return new CssSelector().attr(value);
  },

  pseudoClass(value) {
    return new CssSelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CssSelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return CssSelector.combine(selector1, combinator, selector2);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
