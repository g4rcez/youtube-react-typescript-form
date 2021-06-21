import React, { useCallback, useRef } from "react";

type FnValidate = (str: string, input: HTMLInputElement) => boolean;

type InputRefs<T> = { [k in keyof T]?: HTMLInputElement };

export const useForm = <T>() => {
  const errors = useRef<Partial<{ [k in keyof T]?: string | null }>>({});
  const focus = useRef<Partial<{ [k in keyof T]?: boolean }>>({});
  const ref = useRef<InputRefs<T>>(
    new Proxy(
      {},
      {
        set: (
          target: InputRefs<T>,
          prop,
          { dom, fn }: { dom: HTMLInputElement; fn?: FnValidate }
        ) => {
          const key: keyof T = prop as any;
          if (target[key]) return true;
          if (fn && dom) {
            dom.addEventListener("focus", () => (focus.current[key] = true));
            dom.addEventListener("input", (e) => {
              const a: HTMLInputElement = e.target as any;
              const isValid = fn(a.value, a);
              errors.current[key] = isValid ? a.validationMessage : null;
            });
          }
          target[key] = dom;
          return true;
        },
      }
    )
  );

  React.useEffect(() => {
    console.log(errors);
  });

  const call = useCallback(
    <V extends keyof T>(key: V, validate?: FnValidate) => {
      return {
        ref: (e: any) => {
          ref.current[key] = { dom: e, fn: validate } as any;
        },
      };
    },
    []
  );

  return call;
};
