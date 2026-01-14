import { CreateGuestDto, Guest } from "@/types/guest";
import { api } from "@/utils/api";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface GuestRowProps {
  eventId: string;
  guest?: Guest; // EditMode wenn vorhanden, ansonsten CreateMode
  onGuestAdded?: (guest: Guest) => void;
  // onSave: (data: CreateGuestDto) => Promise<void>;
  // onDelete: (id: string) => Promise<void>;
}

export default function GuestRow({
  eventId,
  guest,
  onGuestAdded,
}: GuestRowProps) {
  const isExistent = !!guest;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, errors },
  } = useForm<CreateGuestDto>({
    mode: "onChange",
    defaultValues: { name: guest?.name || "", email: guest?.email || "" },
  });

  const onSubmit = async (data: CreateGuestDto) => {
    if (isExistent) return;
    setErrorMsg(null);
    try {
      const response = await api.post(`/events/${eventId}/guests`, data);

      if (onGuestAdded) {
        onGuestAdded(response.data);
      }

      reset();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="drag-handle cursor-grab">⋮⋮</div>
      <input
        {...register("name", { required: true, minLength: 2 })}
        placeholder="Name"
        className="input-style"
        disabled={isExistent}
      />
      <div>
        <input
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          placeholder="email@gmx.com"
          className="input-style"
          disabled={isExistent}
        />
        {errorMsg && (
          <span className="text-xs text-red-500 absolute mt-1">{errorMsg}</span>
        )}
      </div>

      <div className="actions">
        {isExistent ? (
          <button type="button" onClick={() => console.log("Edit!")}>
            Edit
          </button>
        ) : (
          <button type="submit" disabled={!isValid}>
            Add
          </button>
        )}
      </div>
    </form>
  );
}
