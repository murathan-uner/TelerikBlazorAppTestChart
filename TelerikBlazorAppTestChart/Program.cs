using Microsoft.AspNetCore.Components.Server;
using Microsoft.AspNetCore.Components.Web;
using TelerikBlazorAppTestChart;
using TelerikBlazorAppTestChart.Components;
using TelerikBlazorAppTestChart.Components.Pages;
using Toolbelt.Blazor.Extensions.DependencyInjection;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddTelerikBlazor();

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.Configure<CircuitOptions>(options =>
{
    options.DetailedErrors = true; // Enable detailed error messages
});

//builder.Services.AddServerSideBlazor(
//    options =>
//    {
//        options.RootComponents.RegisterForJavaScript<ClustersComponent>(identifier: "clusters-component",
//            javaScriptInitializer: "initializeComponent");
//    });

//builder.Services.AddServerSideBlazor(
//    options =>
//    {
//        options.RootComponents.RegisterForJavaScript<Quote>(identifier: "quote",
//            javaScriptInitializer: "initializeComponent1");
//    });

//builder.Services.AddServerSideBlazor(options =>
//{
//    options.RootComponents.RegisterForJavaScript<ClustersComponent>("clusters-component");
//});
//builder.Services.AddServerSideBlazor(options =>
//{
//    options.RootComponents.RegisterForJavaScript<Quote>("quote");
//});

builder.Services.AddHotKeys2();

builder.Services.AddScoped<JsInteropService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();


app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
