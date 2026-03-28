export interface Author{
    id: number;
    full_name: string;
    books: Book[];
}

export interface Genre{
    id: number;
    name: string;
}
export interface Book {
    id: number;
    name: string;
    year_of_release: number;
    description: string;
    image: string | null;
    genre: Genre[];
    author: Author[];
}

//partial утилитарный тип, делает все свойства необязательными
export type UpdateBook = Partial<Book>;