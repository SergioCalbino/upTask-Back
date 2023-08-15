import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tareas.js";

const agregarTarea = async (req, res) => {
    //Primero verifico si antes de agregar la tarea, el proyceto existe;
    const { proyecto } = req.body;

    const existeProyecto = await Proyecto.findById( proyecto );
    if (!existeProyecto) {
        const error = new Error('El proyecto no existe');
        return res.status(404).json({ msg: error.message })
    }
    //Comprubo si la persona que esta dando de alta la tarea es quien creo el proyecto
    if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('No tienes los permisos para añadir tareas');
        return res.status(404).json({ msg: error.message })
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body);
        return res.status(200).json(tareaAlmacenada)
    } catch (error) {
        console.log(error);
        
    }
};

const obtenerTarea = async (req, res) => {
    const { id } = req.params;
    //Ahora busco la tarea por id,y con el populate me traigo el proyecto al cual pertenece la tare.
    //Ahi ya puedo acceder al creador de ese proyecto. De esa forma verifico que la tarea que quiero traer, pertenece al creador de ese proyecto
    const tarea = await Tarea.findById(id).populate('proyecto');
    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return res.status(404).json({ msg: error.message })
    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('No tienes los permisos para buscar esa tarea');
        return res.status(403).json({ msg: error.message })
    } 

        return res.status(200).json(tarea)
    
};

const actualizarTarea = async (req, res) => {
    const { id } = req.params;
    //Ahora busco la tarea por id,y con el populate me traigo el proyecto al cual pertenece la tare.
    //Ahi ya puedo acceder al creador de ese proyecto. De esa forma verifico que la tarea que quiero traer, pertenece al creador de ese proyecto
    const tarea = await Tarea.findById(id).populate('proyecto');
    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return res.status(404).json({ msg: error.message })
    }
    
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('No tienes los permisos para actualizar esa tarea');
        return res.status(403).json({ msg: error.message })
    } 

       //Ahora con la instancia de tarea edito lo que el usuario quiera
       
       tarea.nombre = req.body.nombre || tarea.nombre;
       tarea.descripcion = req.body.descripcion || tarea.descripcion;
       tarea.prioridad = req.body.prioridad || tarea.prioridad;
       tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

       try {
            const tareaAlmacenada = await tarea.save();
            res.json(tareaAlmacenada)
       } catch (error) {
            console.log(error)
       }
};

const eliminarTarea = async (req, res) => {
    const { id } = req.params;
    //Ahora busco la tarea por id,y con el populate me traigo el proyecto al cual pertenece la tare.
    //Ahi ya puedo acceder al creador de ese proyecto. De esa forma verifico que la tarea que quiero traer, pertenece al creador de ese proyecto
    const tarea = await Tarea.findById(id).populate('proyecto');
    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return res.status(404).json({ msg: error.message })
    }
    
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Permisos insuficientes');
        return res.status(403).json({ msg: error.message })
    } 

       //Ahora con la instancia de tarea edito lo que el usuario quiera

       try {
            await tarea.deleteOne();
            return res.json({msg: 'Tarea eliminada'})
       } catch (error) {
            console.log(error)
       }
};

const cambiarEstado = async (req, res) => {};

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}