import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

// This is a simple example component for testing
const ExampleComponent = {
  template: `
    <div>
      <h1>{{ title }}</h1>
      <button @click="increment">Count: {{ count }}</button>
    </div>
  `,
  props: {
    title: {
      type: String,
      default: 'Example Component'
    }
  },
  data() {
    return {
      count: 0
    };
  },
  methods: {
    increment() {
      this.count++;
    }
  }
};

describe('Example Component Test', () => {
  it('renders the component with default props', () => {
    const wrapper = mount(ExampleComponent);
    expect(wrapper.find('h1').text()).toBe('Example Component');
    expect(wrapper.find('button').text()).toContain('Count: 0');
  });

  it('renders the component with custom props', () => {
    const wrapper = mount(ExampleComponent, {
      props: {
        title: 'Custom Title'
      }
    });
    expect(wrapper.find('h1').text()).toBe('Custom Title');
  });

  it('increments the counter when button is clicked', async () => {
    const wrapper = mount(ExampleComponent);
    expect(wrapper.find('button').text()).toContain('Count: 0');

    await wrapper.find('button').trigger('click');
    expect(wrapper.find('button').text()).toContain('Count: 1');

    await wrapper.find('button').trigger('click');
    expect(wrapper.find('button').text()).toContain('Count: 2');
  });
});
