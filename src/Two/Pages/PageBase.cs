#nullable disable

using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Two.Pages;

public class PageBase : ComponentBase
{
    [Inject]
    protected IJSRuntime Js { get; set; }

    protected bool isLoading { get; set; }

    protected async Task AlertAsync(object message)
    {
        await Js.InvokeVoidAsync("alert", message);
    }

    protected async Task ErrorAsync(Exception ex)
    {
        if (ex.InnerException is not null)
        {
            await AlertAsync(ex.InnerException.Message);
        }
        else
        {
            await AlertAsync(ex.Message);
        }
        await Js.InvokeVoidAsync("console.error", ex.StackTrace);
        SetLoading(false);
    }

    protected void SetLoading(bool value)
    {
        isLoading = value;
    }
}