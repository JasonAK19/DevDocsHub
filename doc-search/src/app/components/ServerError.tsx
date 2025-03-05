'use client';
import { useFormState } from 'react-dom';

interface ServerErrorProps {
  error: string;
  reset: (prevState: any, formData: FormData) => Promise<any>;
}

export default function ServerError({ error, reset }: ServerErrorProps) {
  const [state, formAction] = useFormState(reset, null);

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
      <p className="text-red-500 mb-4">{error}</p>
      <form action={formAction}>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
        >
          Try Again
        </button>
      </form>
    </div>
  );
}