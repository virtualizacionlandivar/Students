document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://localhost:5000/api/Student"; // URL de la API
    const studentList = document.getElementById("student-list");
    const studentForm = document.getElementById("student-form");
    let editingStudentId = null; // Inicializa la variable

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
                        <button class="delete-btn" data-id="${student.id}">Eliminar</button>
                        <button class="edit-btn" data-id="${student.id}" data-name="${student.name}" data-email="${student.email}">Editar</button>
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

                        // Llenar los campos del formulario con los valores actuales del estudiante
                        document.getElementById("name").value = studentName;
                        document.getElementById("email").value = studentEmail;

                        editingStudentId = studentId; // Guardar el ID del estudiante en edición
                        const submitButton = document.getElementById("submit-btn");
                        if (submitButton) {
                            submitButton.textContent = "Actualizar Estudiante"; // Asegurarse de que el botón exista
                        }

                        console.log("Editando estudiante con ID:", studentId); // Depuración
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


    //
    async function createStudent() {
        const studentData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            grades: []
        };
    
        try {
            const response = await fetch("http://localhost:5000/api/Student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(studentData)
            });
    
            if (response.ok) {
                alert("Estudiante agregado correctamente");
                loadStudents(); // Recargar la lista después de agregar
            } else {
                const errorResponse = await response.json();
                console.error("Error:", errorResponse);
                alert("Error al agregar estudiante. Verifica los datos.");
            }
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
        }
    }//
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

    //
    async function updateStudent(id) {
    const studentData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value
        
    };

    try {
        const response = await fetch(`http://localhost:5000/api/Student/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });
        if (response.status === 204) { 
            alert("Estudiante actualizado correctamente");
            loadStudents(); // Recargar lista de estudiantes
            return;
        }

        if (response.ok) {
            const result = await response.json();
            alert("Estudiante actualizado correctamente");
            console.log(result);
            loadStudents(); 
        } else {
            const errorText = await response.text();
            console.error("Error:", errorText);
            alert("Error al actualizar estudiante.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

    //

    // 🔹 Función para agregar o actualizar un estudiante
    studentForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Evitar recargar la página

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        if (!name || !email) {
            alert("Por favor, ingresa un nombre y un correo.");
            return;
        }

        const studentData = {
            id: editingStudentId,
            name: name,
            email: email,

        };

        console.log("Datos del estudiante a enviar:", studentData); // Depuración

        if (editingStudentId) {
            // 🔹 Si hay un ID en edición, hacer una petición PUT para actualizar
            console.log("Actualizando estudiante con ID:", editingStudentId); // Depuración
            console.log("Datos enviados en la actualización:", JSON.stringify(studentData)); // Depuración
            fetch(`${apiUrl}/${editingStudentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(studentData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al actualizar el estudiante");
                }
                return response.json();
            })
            .then(() => {
                alert("Estudiante actualizado correctamente");
                loadStudents(); // Recargar la lista de estudiantes
                studentForm.reset(); // Limpiar formulario
                const submitButton = document.getElementById("submit-btn");
                if (submitButton) {
                    submitButton.textContent = "Agregar Estudiante"; // Restablecer el texto del botón
                }
                editingStudentId = null; // Resetear el ID en edición
            })
            .catch(error => console.error("Error al actualizar estudiante:", error));

        } else {
            // 🔹 Si no hay ID en edición, hacer una petición POST para agregar
            fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(studentData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al agregar el estudiante");
                }
                return response.json();
            })
            .then(() => {
                alert("Estudiante agregado correctamente");
                loadStudents(); // Recargar la lista de estudiantes
                studentForm.reset(); // Limpiar formulario
            })
            .catch(error => console.error("Error al agregar estudiante:", error));
        }
    });
});
