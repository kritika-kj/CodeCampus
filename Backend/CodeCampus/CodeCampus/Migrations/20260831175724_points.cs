using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodeCampus.Migrations
{
    /// <inheritdoc />
    public partial class points : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AwardedPoints",
                table: "Submissions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AwardedPoints",
                table: "Submissions");
        }
    }
}
