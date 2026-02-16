import axios from 'axios';

const test = async () => {
    try {
        console.log('--- Buscando Batman ---');
        const searchResponse = await axios.get('https://superhero-backend-yoxj.onrender.com/api/superhero/search/Batman');
        if (searchResponse.data.success && searchResponse.data.data.length > 0) {
            const batman = searchResponse.data.data[0];
            console.log('Batman ID:', batman.id);
            
            console.log('--- Obteniendo detalles de Batman ---');
            const detailsResponse = await axios.get(`https://superhero-backend-yoxj.onrender.com/api/superhero/character/${batman.id}`);
            console.log(JSON.stringify(detailsResponse.data, null, 2));
        } else {
            console.log('No se encontró a Batman');
        }

        console.log('--- Verificando ID 620 (Original) ---');
        const originalResponse = await axios.get('https://superhero-backend-yoxj.onrender.com/api/superhero/character/620');
        console.log(JSON.stringify(originalResponse.data, null, 2));

    } catch (error) {
        console.error('Error:', error.message);
    }
};

test();
