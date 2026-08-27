using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodeCampus.Migrations
{
    /// <inheritdoc />
    public partial class durationincontest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DurationInHours",
                table: "Contests",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DurationInHours",
                table: "Contests");
        }
    }
}
