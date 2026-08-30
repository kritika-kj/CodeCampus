using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodeCampus.Migrations
{
    /// <inheritdoc />
    public partial class a : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TestCases_Challenges_ChallengesId",
                table: "TestCases");

            migrationBuilder.DropIndex(
                name: "IX_TestCases_ChallengesId",
                table: "TestCases");

            migrationBuilder.DropColumn(
                name: "ChallengesId",
                table: "TestCases");

            migrationBuilder.CreateIndex(
                name: "IX_TestCases_ChallengeId",
                table: "TestCases",
                column: "ChallengeId");

            migrationBuilder.AddForeignKey(
                name: "FK_TestCases_Challenges_ChallengeId",
                table: "TestCases",
                column: "ChallengeId",
                principalTable: "Challenges",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TestCases_Challenges_ChallengeId",
                table: "TestCases");

            migrationBuilder.DropIndex(
                name: "IX_TestCases_ChallengeId",
                table: "TestCases");

            migrationBuilder.AddColumn<int>(
                name: "ChallengesId",
                table: "TestCases",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TestCases_ChallengesId",
                table: "TestCases",
                column: "ChallengesId");

            migrationBuilder.AddForeignKey(
                name: "FK_TestCases_Challenges_ChallengesId",
                table: "TestCases",
                column: "ChallengesId",
                principalTable: "Challenges",
                principalColumn: "Id");
        }
    }
}
