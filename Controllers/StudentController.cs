using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAPI.Data;
using StudentAPI.Models;

namespace StudentAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/student
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            return await _context.Students.Include(s => s.Grades).ToListAsync();
        }

        // GET: api/student/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            var student = await _context.Students.Include(s => s.Grades)
                                                 .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null)
            {
                return NotFound();
            }

            return student;
        }

        // POST: api/student
        [HttpPost]
public async Task<ActionResult<Student>> PostStudent(Student student)
{
    if (student == null)
    {
        return BadRequest("Student data is required.");
    }

    _context.Students.Add(student);
    await _context.SaveChangesAsync();

    if (student.Grades != null && student.Grades.Any())
    {
        foreach (var grade in student.Grades)
        {
            grade.StudentId = student.Id;  // Aseguramos que la nota esté asociada al estudiante
        }
    }

    await _context.SaveChangesAsync();
    return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
}

//

        // PUT: api/student/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(int id, Student student)
        {
            if (id != student.Id)
            {
                return BadRequest(new { message = "El ID no coincide." });
            }
            _context.Entry(student).State = EntityState.Modified;
            try
                {
                    await _context.SaveChangesAsync();
                    return Ok(student); // No devuelve JSON, solo un código 204 (éxito sin contenido)
                }
                catch (DbUpdateConcurrencyException)
                {
                    return NotFound(new { message = "El estudiante no existe." });
                }
        }

        // DELETE: api/student/5
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteStudent(int id)
{
    var student = await _context.Students.Include(s => s.Grades).FirstOrDefaultAsync(s => s.Id == id);
    
    if (student == null)
    {
        return NotFound(); // Si no se encuentra el estudiante
    }

    // Eliminar las notas asociadas, si las hay
    if (student.Grades != null && student.Grades.Any())
    {
        _context.Grades.RemoveRange(student.Grades);
    }

    _context.Students.Remove(student); // Eliminar al estudiante
    await _context.SaveChangesAsync(); // Guardar los cambios en la base de datos

    return NoContent(); // Retornar 204 No Content, indicando que se eliminó correctamente
}

    }
}
