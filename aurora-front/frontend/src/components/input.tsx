export default function Input({ label, errorMsg, register, textArea = false, ...props }: any) {
    return (
        <div className="w-full flex flex-col">
            <label className="text-left mb-1 font-bold text-">{label}</label>
            {textArea ? <textarea {...register} {...props} /> : <input {...register} {...props} />}
            {errorMsg && <p className="text-red-800 text-sm">{errorMsg}</p>}
        </div>
    );
}