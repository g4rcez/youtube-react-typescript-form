import { FormEvent, useState } from "react";
import "tailwindcss/dist/tailwind.css";
import "./App.css";
import { Input, Validate, Validations } from "./form";

type State = {
  name: string;
  age: number;
};

const validations: Validations<State> = {
  age: (e) =>
    !Number.isNaN(e.valueAsNumber) && e.valueAsNumber > 18
      ? null
      : "Você precisa ser maior de idade",
  name: (e) => e.value === "" ? "Você precisa preencher o nome" : null,
};

type Errors<T> = Partial<
  {
    [k in keyof T]: string;
  }
>;

const App = () => {
  const [errors, setErrors] = useState<Errors<State>>({});
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
  };

  const onInvalid = (e: FormEvent<HTMLFormElement>) => {
    setErrors(Validate(validations, e.currentTarget));
  };

  return (
    <form
      onSubmit={onSubmit}
      onInvalid={onInvalid}
      className="grid grid-cols-3 gap-x-4 p-4"
    >
      <Input required name="name" placeholder="Name" feedback={errors.name} />
      <Input
        feedback={errors.age}
        required
        name="age"
        type="number"
        placeholder="Age"
        min={18}
        step={1}
      />
      <button
        type="submit"
        style={{ height: "min-content" }}
        className="px-4 h-fit text-white py-2 bg-blue-300 active:bg-blue-500 hover:bg-blue-500 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default App;
