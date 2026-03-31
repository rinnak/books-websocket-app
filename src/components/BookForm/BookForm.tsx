import {useForm} from "react-hook-form";

export type BookFormValues = {
    name: string;
    year_of_release: number;
    description: string;
    image: FileList  | null;
}
type Props = {
    onSubmit: (data: BookFormValues) => void;
    initialData?: Partial<BookFormValues>;
}
export function BookForm({onSubmit, initialData}: Props){
    const{
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm<BookFormValues>({
        defaultValues: initialData || {
            year_of_release: 2026,
            description: "",
            name: ""
        },
    });

    return (
        <form
            onSubmit={handleSubmit((data) => {
                onSubmit(data);
                reset();
            })}
            className="p-4 border rounded-xl space-y-4 max-w-md"
        >

            <h2 className="text-xl font-bold">Добавить книгу</h2>
            <div>
                <input placeholder="Название"
                       {...register("name", {
                           required:"Введите название книги",
                       })}
                    className="w-full border p-2 rounded-xl"
                />
                {errors.name && (
                    <p className="text-red-500">
                        {errors.name.message}
                    </p>
                )}
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Год издания"
                    {...register("year_of_release", {
                        required: "Введите год",
                        min:{
                            value: 1800,
                            message: "минимум 1800"
                        },
                        max:{
                            value:2026,
                            message:"максимум 2026"
                        },
                        valueAsNumber: true,
                    })}
                    className="w-full border p-2 rounded-xl"
                />
                {errors.year_of_release && (
                    <p className="text-red-500">{errors.year_of_release.message}</p>
                )}
            </div>
            <div>
                <textarea
                    placeholder="Описание"
                    {...register("description")}
                    className="w-full border p-2 rounded-xl"
                />
            </div>
            <div>
                <input
                    type="file"
                    {...register("image")}
                    className="w-full rounded-xl border p-2 rounded-xl cursor-pointer"
                />
            </div>
            <button type="submit" className="mb-4 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition">Создать</button>
        </form>
    )
}