import {useBooks} from "./hooks/useBooks";
import {BookForm} from "./components/BookForm/BookForm";
import type {BookFormValues} from "./components/BookForm/BookForm";
import {BookList} from "./components/BookList/BookList";
import {api} from "./services/api"

function App() {
    const {books, refetch} = useBooks();
    console.log("Список книг с сервера:", books);
    console.log("ID книг:", books.map(b => b.id));
    const handleCreate = async (data: BookFormValues) => {

        try{
            let imgName: string | null = null;
            if (data.image && data.image.length > 0) {
                const formData = new FormData();
                formData.append("image", data.image[0]);
                const res = await api.post("/image/url", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                imgName = res.data.name;
            }
            await api.post("/book", {
                name: data.name,
                year_of_release: Number(data.year_of_release),
                description: data.description,
                genre: [1],
                author: [22],
                image: imgName,
            });
            refetch();
        }
        catch(err){
            console.log(err);
            alert("не удалось создать книгу")
        }
    };

    return(
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <BookForm onSubmit={handleCreate} />
            <BookList books={books} refetch={refetch} />
        </div>
    );
}

export default App;