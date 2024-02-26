"use client";
import { useEffect, useState } from 'react';

import axios from 'axios';

type TFurniture = {
    id?: number;
    name: string;
    category: string;
}
type TRes = {
    msg: string;
    data?: any
}


const headers = {
    headers: {
        "Content-Type": "application/json",
    }
}

export default function CrudFurniturePage() {
    useEffect(() => {
        getFurnitures();
    }, []);

    const [furnitures, setFurnitures] = useState<TFurniture[]>([]);
    const [furniture, setFurniture] = useState<TFurniture>({
        name: "",
        category: ""
    });

    const [isEditable, setIsEditable] = useState(false);

    const onChange = (e: any) => {
        const data: any = furniture;
        data[e.target.name] = e.target.value;
        setFurniture(data);
    }



    const getFurnitures = async () => {
        try {
            const response = await axios.get<TRes>(`${process.env.NEXT_PUBLIC_API_REST_URL}/get`);

            if (response.data.data) {
                setFurnitures(response.data.data);
            }
        } catch (error) {
            alert(`Hubo un error al realizar la peticion: ${error}`);
        }
    }

    const createFurnitures = async () => {
        try {
            await axios.post<TRes>(`${process.env.NEXT_PUBLIC_API_REST_URL}/create`, furniture, headers);
            getFurnitures();
        } catch (error) {
            alert(`Hubo un error al realizar la peticion: ${error}`);
        }
    }

    const updateFurniture = async (id: number) => {
        try {
            await axios.put<TRes>(
                `${process.env.NEXT_PUBLIC_API_REST_URL}/update/${id}`,
                furniture,
                headers
            );
            getFurnitures();
            setIsEditable(false);
        } catch (error) {
            alert(`Hubo un error al realizar la peticion: ${error}`);
        }
    }

    const deleteFurniture = async (id: number) => {
        try {
            await axios.delete<TRes>(
                `${process.env.NEXT_PUBLIC_API_REST_URL}/delete/${id}`,
            );
            getFurnitures();
        } catch (error) {
            alert(`Hubo un error al realizar la peticion: ${error}`);
        }
    }

    const preUpdate = (e: TFurniture) => {
        setFurniture(e);
        setIsEditable(true);
    }

    return (
        <div>
            <h1>CRUD De Muebles</h1>
            <div>
                <label htmlFor="name">Ingresa el nombre del mueble:</label><br />
                <input
                    type="text"
                    onChange={(e) => onChange(e)}
                    name='name'
                    placeholder='Nombre'
                /><br />
                <label htmlFor="category">Ingresa la categoria del mueble:</label><br />
                <input
                    type="text"
                    onChange={(e) => onChange(e)}
                    name='category'
                    placeholder='Lugar'
                /><br />
            </div>
            <button onClick={createFurnitures}>Agregar mueble</button>
            <table>
                <tr>
                    <th>Nombre</th>
                    <th>Categoria</th>
                    <th>Opciones</th>
                </tr>
                {furnitures.map((furniture, index) => (
                    <tr key={index}>
                        <td>{furniture.name}</td>
                        <td>{furniture.category}</td>
                        <td>
                            <button onClick={() => deleteFurniture(furniture.id ?? 0)}>Delete</button>
                        </td>
                        <td>
                            <button onClick={() => preUpdate(furniture)}>Update</button>
                        </td>
                    </tr>
                ))}
            </table>

            {
                isEditable && (
                    <div>
                        <h2>Formulario para actualizar</h2>
                        <div>
                            <label htmlFor="name">Ingresa el nombre del mueble:</label><br />
                            <input
                                type="text"
                                onChange={(e) => onChange(e)}
                                name='name'
                                defaultValue={furniture.name}
                            /><br />
                            <label htmlFor="category">Ingresa la categoria del mueble:</label><br />
                            <input
                                type="text"
                                onChange={(e) => onChange(e)}
                                name='category'
                                defaultValue={furniture.category}
                            /><br />
                        </div>
                        <button onClick={() => updateFurniture(furniture.id ?? 0)}>Guardar</button>
                    </div>
                )
            }
        </div>
    );
}
