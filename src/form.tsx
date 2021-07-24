import { DetailedHTMLProps, InputHTMLAttributes } from "react";

type HtmlInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type OmitKeys<T, U extends keyof T> = Omit<T, U>;

export type Elements<T> = HTMLFormControlsCollection &
  {
    [k in keyof T]: HTMLInputElement;
  };

export type InputProps<T> = OmitKeys<HtmlInputProps, "name" | "children"> & {
  name: keyof T;
  feedback?: string;
};

export type Validations<T> = {
  [k in keyof T]: (input: HTMLInputElement) => string | null;
};

export const Keyof = <T,>(o: T): Array<keyof T> => Object.keys(o) as never;

export const Validate = <T,>(
  validations: Validations<T>,
  form: HTMLFormElement
) => {
  const elements: Elements<T> = form.elements as never;
  return Keyof(validations).reduce((acc, el) => {
    const fn = validations[el];
    const element = elements[el];
    const errorMessage = fn(element);
    if (errorMessage === null) {
      element.setCustomValidity("");
      return acc;
    }
    element.setCustomValidity(errorMessage);
    return { ...acc, [el]: errorMessage };
  }, {});
};

export const Input: <T>(props: InputProps<T>) => JSX.Element = ({
  feedback,
  ...props
}) => (
  <div className="w-full">
    <input
      {...props}
      className="input w-full block"
      name={props.name as string}
    />
    {feedback && <small className="text-red-400">{feedback}</small>}
  </div>
);
