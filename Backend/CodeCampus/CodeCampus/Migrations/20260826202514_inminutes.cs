using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodeCampus.Migrations
{
    /// <inheritdoc />
    public partial class inminutes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DurationInHours",
                table: "Contests",
                newName: "DurationInMinutes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DurationInMinutes",
                table: "Contests",
                newName: "DurationInHours");
        }
    }
}
