import { Action, AsyncAction, ServerAction } from "../action";
import Package from "../package";
import Derived from "../derived";

interface Package1 extends Package {
  name: "package-1";
  state: {
    namespace1: {
      prop1: string;
      prop2: number;
      prop3: Derived<Package1, string>;
      prop4: Derived<Package1, string, number>;
      array1: string[];
      nested1: {
        prop5: Derived<Package1, string, number>;
        array2: number[];
        nested2: {
          prop6: Derived<Package1, string>;
        };
      };
    };
  };
  actions: {
    namespace1: {
      action1: Action<Package1>;
      action2: AsyncAction<Package1>;
    };
    namespace2: {
      action3: Action<Package1, string>;
      action4: AsyncAction<Package1, number>;
      action5: Action<Package1, number, string, number, string, number, string>;
      action6: Action<Package, number> | Action<Package, number, string>;
      action7: ServerAction<Package>;
    };
  };
  libraries: {
    namespace1: {
      lib1: string;
    };
  };
}

const package1: Package1 = {
  name: "package-1",
  state: {
    namespace1: {
      prop1: "prop1",
      prop2: 2,
      prop3: ({ state }) => state.namespace1.prop1,
      prop4: ({ state }) => (str) => str.length + state.namespace1.prop2,
      array1: ["item1", "item2"],
      nested1: {
        prop5: ({ state }) => (str) => str.length + state.namespace1.prop2,
        array2: [3, 4],
        nested2: {
          prop6: ({ state }) => state.namespace1.prop1,
        },
      },
    },
  },
  actions: {
    namespace1: {
      // Action without params.
      action1: ({ state, actions, libraries }) => {
        state.namespace1.prop1 = "newProp";
        state.namespace1.prop2 = 3;

        state.namespace1.prop3 = "asdf";

        // Check that prop3 is a string (and not a function).
        const str1: string = state.namespace1.prop3;

        // Check that prop4 returns a number (and not a function).
        const num1: number = state.namespace1.prop4("123");

        // Check that nested derived state functions are processed correctly.
        const num2: number = state.namespace1.nested1.prop5("123");

        // Check that nested nested derived state is processed correctly.
        const str2: string = state.namespace1.nested1.nested2.prop6;

        // Check that arrays are fine.
        state.namespace1.array1.map((item: string): string => item);

        // Check that nested arrays are fine.
        state.namespace1.nested1.array2.map((item: number): number => item + 1);

        // Check that actions are accesible.
        actions.namespace1.action2();
        actions.namespace2.action3("123");

        // Check that libraries are accesible.
        const str3: string = libraries.namespace1.lib1;

        // Check that actions with multiple parameters work.
        actions.namespace2.action5(1, "2", 3, "4", 5, "6");

        // Check that actions with optional parameters work.
        actions.namespace2.action6(1);
        actions.namespace2.action6(1, "2");
      },
      // Async Action without params.
      action2: async ({ state, actions }) => {
        state.namespace1.prop1 = "newProp";
        await Promise.resolve();
        const str1: string = state.namespace1.prop3;
        await Promise.resolve();
        const num1: number = state.namespace1.prop4("123");
        actions.namespace2.action3("123");
        await actions.namespace1.action2();
        await actions.namespace2.action4(123);
      },
    },
    namespace2: {
      // Action with params.
      action3: ({ state }) => (str) => {
        state.namespace1.prop1 = str;
        const str1: string = state.namespace1.prop3 + str;
        const num1: number = state.namespace1.prop4(str);
      },
      // Async Action with params.
      action4: ({ state }) => async (num) => {
        state.namespace1.prop2 = num;
        await Promise.resolve();
        const num1: number = state.namespace1.prop4("123") + num;
        await Promise.resolve();
        const num2: number = state.namespace1.nested1.prop5("123") + num;
      },
      // Action with mutilple parameters.
      action5: ({ state, actions }) => (num1, str1, num2, str2, num3, str3) => {
        state.namespace1.prop2 = num1;
        state.namespace1.prop1 = str1;
        state.namespace1.prop2 = num2;
        state.namespace1.prop1 = str2;
        state.namespace1.prop2 = num3;
        state.namespace1.prop1 = str3;
      },
      // Action with optional parameters.
      action6: ({ state }) => (num, str) => {
        state.namespace1.prop2 = num;
        state.namespace1.prop1 = str;
      },
      action7: ({ state }) => async ({ ctx, state: state2 }) => {
        const num: number = state.namespace1.prop2;
        const num2: number = state2.namespace1.prop2;
        const num3: number = ctx.state.namepsace1.prop2;
      },
    },
  },
  libraries: {
    namespace1: {
      lib1: "lib1",
    },
  },
};

test("Types are fine!", () => {});
