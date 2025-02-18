document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://localhost:5000/api/Student"; // URL de la API
    const studentList = document.getElementById("student-list");
    const studentForm = document.getElementById("student-form");
    let editingStudentId = null; // Variable para saber si estamos editando un estudiante

    // 🔹 Función para cargar la lista de estudiantes desde la API
    function loadStudents() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al obtener los estudiantes");
                }
                return response.json();
            })
            .then(data => {
                studentList.innerHTML = ""; // Limpiar la lista antes de cargar

                data.forEach(student => {
                    const studentItem = document.createElement("div");
                    studentItem.innerHTML = `
                        <p><strong>ID:</strong> ${student.id} - <strong>Nombre:</strong> ${student.name} - <strong>Correo:</strong> ${student.email}</p>
                        <button class="edit-btn" data-id="${student.id}" data-name="${student.name}" data-email="${student.email}">Editar</button>
                        <button class="delete-btn" data-id="${student.id}">Eliminar</button>
                    `;
                    studentList.appendChild(studentItem);
                });

                // Agregar eventos a los botones de eliminar
                document.querySelectorAll(".delete-btn").forEach(button => {
                    button.addEventListener("click", () => {
                        const studentId = button.getAttribute("data-id");
                        deleteStudent(studentId);
                    });
                });

                // Agregar eventos a los botones de editar
                document.querySelectorAll(".edit-btn").forEach(button => {
                    button.addEventListener("click", () => {
                        const studentId = button.getAttribute("data-id");
                        const studentName = button.getAttribute("data-name");
                        const studentEmail = button.getAttribute("data-email");

                        // Cargar los datos en el formulario
                        document.getElementById("name").value = studentName;
                        document.getElementById("email").value = studentEmail;
                        editingStudentId = studentId;
                    });
                });
            })
            .catch(error => {
                console.error("Error:", error);
                studentList.innerHTML = "<p>No se pudieron cargar los estudiantes.</p>";
            });
    }

    // 🔹 Cargar la lista de estudiantes al iniciar
    loadStudents();

    // 🔹 Función para eliminar un estudiante
    async function deleteStudent(id) {
        if (!confirm("¿Seguro que deseas eliminar este estudiante?")) return;

        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Estudiante eliminado correctamente");
                loadStudents(); // Recargar la lista sin hacer refresh
            } else {
                alert("Error al eliminar estudiante");
            }
        } catch (error) {
            console.error("Error al eliminar estudiante:", error);
        }
    }

    // 🔹 Función para agregar o actualizar un estudiante
    studentForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Evitar recargar la página

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        if (editingStudentId) {
            // Si estamos editando, hacemos un PUT
            updateStudent(editingStudentId, { name, email });
        } else {
            // Si no, agregamos un nuevo estudiante con POST
            addStudent({ name, email });
        }
    });

    // 🔹 Función para agregar un nuevo estudiante
    function addStudent(studentData) {
        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData)
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al agregar el estudiante");
            return response.json();
        })
        .then(() => {
            alert("Estudiante agregado con éxito");
            studentForm.reset();
            loadStudents(); // Recargar la lista
        })
        .catch(error => console.error("Error:", error));
    }

    // 🔹 Función para actualizar un estudiante
    function updateStudent(id, studentData) {
        fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData)
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al actualizar el estudiante");
            return response.json();
        })
        .then(() => {
            alert("Estudiante actualizado con éxito");
            studentForm.reset();
            editingStudentId = null; // Resetear la variable de edición
            loadStudents(); // Recargar la lista
        })
        .catch(error => console.error("Error:", error));
    }
});
