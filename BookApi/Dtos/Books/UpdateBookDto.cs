namespace BookApi.DTOs.Books;

public class UpdateBookDto
{
    public string Title { get; set; } = string.Empty;

    public string Author { get; set; } = string.Empty;

    public DateTime PublishDate { get; set; }
}