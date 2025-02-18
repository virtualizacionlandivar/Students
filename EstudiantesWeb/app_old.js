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
                    studentItem.innerHTML = `<p><strong>ID:</strong> ${student.id} - <strong>Nombre:</strong> ${student.name} - <strong>Correo:</strong> ${student.email}</p>`;
                             studentList.appendChild(studentItem);
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
