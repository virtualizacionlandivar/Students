document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://localhost:5000/api/Student"; // URL de la API
    const studentList = document.getElementById("student-list");
    const studentForm = document.getElementById("student-form");

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

        document.getElementById("name").value = studentName;
        document.getElementById("email").value = studentEmail;

        editingStudentId = studentId; // Guardar el ID del estudiante en edición
        document.getElementById("submit-btn").textContent = "Actualizar Estudiante";
    });
            
     
        });

        //

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

    

    // 🔹 Hacer la función accesible globalmente
    window.deleteStudent = deleteStudent;

     // 🔹 Función para agregar o actualizar un estudiante
    studentForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Evitar recargar la página

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        const studentData = {
            name: name,
            email: email
        };

        if (editingStudentId) {
            // 🔹 Si hay un ID en edición, hacer una petición PUT para actualizar
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
                document.getElementById("submit-btn").textContent = "Agregar Estudiante";
                editingStudentId = null; // Resetear el ID en edición
            })
            .catch(error => console.error("Error:", error));

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
            .catch(error => console.error("Error:", error));
        }
    });

    //



    // 🔹 Función para agregar un nuevo estudiante
    studentForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Evitar recargar la página

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        const newStudent = {
            name: name,
            email: email
        };

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newStudent)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al agregar el estudiante");
            }
            return response.json();
        })
        .then(data => {
            console.log("Estudiante agregado:", data);
            loadStudents(); // Recargar la lista de estudiantes
            studentForm.reset(); // Limpiar formulario
        })
        .catch(error => console.error("Error:", error));
    });
});
