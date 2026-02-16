// APPLY THIS LATER

// import "./RegisterForm.css";
// import { RegisterState } from "@/lib/types/auth";

// import { Button } from "@/components/ui/button/Button";
// import { TextInput } from "@/components/ui/inputs/TextInput";

// type RegisterFormProps = {
//   formAction: (formData: FormData) => void;
//   formState: RegisterState;
//   isPending: boolean;
//   email: string;
//   header: string;
//   subheader: string;
//   buttonPendingText: string;
//   buttonDefaultText: string;
// };

// export default function RegisterForm({
//   formAction,
//   formState,
//   isPending,
//   email,
//   header,
//   subheader,
//   buttonPendingText,
//   buttonDefaultText,
// }: RegisterFormProps) {
//   return (
//     <form className="register-form" action={formAction}>
//       <div className="form-headers">
//         <h1>{header}</h1>
//         <h2>{subheader}</h2>
//       </div>
//       <TextInput
//         label="email"
//         name="email"
//         id="email"
//         type="email"
//         placeholder="Enter your email"
//         className="email-field"
//         required
//         errors={formState.errors?.email ?? []}
//         defaultValue={email}
//       />

//       <Button className="register-btn" type="submit" disabled={isPending}>
//         {isPending ? `${buttonPendingText}` : `${buttonDefaultText}`}
//       </Button>
//     </form>
//   );
// }
