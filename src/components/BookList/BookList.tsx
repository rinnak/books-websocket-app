import type {Book} from "../../types"

type Props = {
    books: Book[];
}

export function BookList({books}: Props) {
    return(
        <div>
            <h1 className="font-bold text-3xl font-bold ">Каталог книг</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {books.map((book) => (
                    <div key={book.id} className="border rounded-xl p-4">
                        <img src={
                            book.image
                                ? `http://158.160.203.172:8080/image/${book.image}`
                                : "/placeholder.png"
                        } alt={book.name} className="w-full h-48 object-cover rounded-xl mb-2"/>
                        <h2 className="text-xl font-semibold">{book.name}</h2>
                        {book.year_of_release && <p>Год выпуска: {book.year_of_release}</p>}
                        {book.description && <p>{book.description}</p>}

                    </div>
                ))}

            </div>
        </div>
    );
}
