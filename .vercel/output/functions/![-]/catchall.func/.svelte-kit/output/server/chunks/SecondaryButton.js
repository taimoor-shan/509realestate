import { G as fallback, D as slot, K as bind_props } from "./index.js";
import { B as BaseButton } from "./PrimaryButton.js";
function SecondaryButton($$payload, $$props) {
  let disabled = fallback($$props["disabled"], void 0);
  let type = fallback($$props["type"], "button");
  let size = fallback($$props["size"], void 0);
  let href = fallback($$props["href"], void 0);
  BaseButton($$payload, {
    href,
    type,
    size,
    disabled,
    styles: "font-medium hover:bg-gray-100 focus:ring-gray-100 border-2 border-gray-100 bg-white",
    children: ($$payload2) => {
      $$payload2.out += `<!---->`;
      slot($$payload2, $$props, "default", {});
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
  bind_props($$props, { disabled, type, size, href });
}
export {
  SecondaryButton as S
};
