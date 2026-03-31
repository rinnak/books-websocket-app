import type {Book} from "../../types"
import {api} from "../../services/api";
import {deleteBook, patchBook, updateBook} from "../../services/books.ts";
import {BookForm, type BookFormValues} from "../BookForm/BookForm.tsx";
import {useState} from "react";

type Props = {
    books: Book[];
    refetch: () => void;
}

export function BookList({books, refetch}: Props) {

    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");

    const handleEditClick = (book: Book) => {
        setEditingBook(book);
        window.scrollTo({ top: 10, behavior: "smooth" });
    };

    const processedBooks = books.
        filter(book =>
        book.name.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sort == "name"){
                return a.name.localeCompare(b.name);
            }
            if (sort == "year"){
                return a.year_of_release - b.year_of_release;
            }
            return 0;
        }

    )


    const handleDelete = async (id: number) => {
        try{
            await deleteBook(id);
            refetch();
        }
        catch(err){
            console.log(err);
            alert("Не удалось удалить книгу");
        }
    }

    const handleChangeName = async (id:number, currentName:string) => {
        const newName = prompt("Введите новое название", currentName);
        if (!newName || newName === currentName) return;

        try{
            await patchBook(id, {name: newName});
            refetch();
        }
        catch(err){
            console.log(err);
            alert("не удалось изменить название");
        }
    }

    const handleUpdate = async(data: BookFormValues) => {
        if (!editingBook) return;
        try{

            let imgName = editingBook.image;
            if (data.image && data.image.length > 0){
                const formData = new FormData();
                formData.append("image", data.image[0]);
                const res = await api.post("/image/url", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                imgName = res.data.name;
            }
            await updateBook(editingBook.id, {
                name:data.name,
                year_of_release: data.year_of_release,
                description: data.description,
                genre: [1],
                author: [22],
                image: imgName,
            });
            refetch();
            setEditingBook(null);
        }
        catch(err){
            console.log(err);
            alert("ошибка обновления")
        }
    };

    return(
        <div>
            <div className="flex flex-row gap-2 mt-12">
                <input  placeholder="Поиск" value = {search} onChange={(e) => setSearch(e.target.value)} className="border p-2 rounded-xl"/>
                <select onChange={(e) => setSort(e.target.value)} className="border p-2 rounded-xl ml-2">
                    <option value = "name">По названию</option>
                    <option value="year">По году</option>
                </select>
            </div>
            <h1 className="font-bold text-3xl font-bold mt-2 mb-4">Каталог книг</h1>
            {editingBook && (
                <BookForm onSubmit={handleUpdate} initialData={{
                    name: editingBook.name,
                    year_of_release: editingBook.year_of_release ?? 2026,
                    description: editingBook.description ?? "",
                    image: null
                }} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {processedBooks.map((book) => (
                    <div key={book.id} className="border rounded-xl p-4">
                        <img src={
                            book.image
                                ? (window.location.hostname === "localhost"
                                    ? `http://158.160.203.172:8080/image/${book.image}`
                                    : `/api/image/${book.image}`)
                                : "/placeholder.png"
                        } alt={book.name} className="w-full h-48 object-cover rounded-xl mb-2"/>
                        <h2 className="text-xl font-semibold">{book.name}</h2>
                        <button onClick={() => handleDelete(book.id)} className="mt-4 mr-2 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition">Удалить</button>
                        <button onClick={() => handleChangeName(book.id, book.name)} className="mt-4 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition">Изменить название</button>
                        <button onClick={() => handleEditClick(book)} className="mt-2 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition">Редактировать</button>
                        {book.year_of_release && <p>Год выпуска: {book.year_of_release}</p>}
                        {book.description && <p>{book.description}</p>}

                    </div>
                ))}

            </div>
        </div>
    );
}
