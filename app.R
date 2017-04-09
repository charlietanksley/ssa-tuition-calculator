#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

library(shiny)
library(dplyr)

tuition_data = data.frame(
  income = c(10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000),
  price = c(180, 360, 720, 1260, 1980, 2880, 3960, 5220, 6660, 8280, 10080, 12060, 14220, 15000),
  income_range = c('Under 20,000', '20,000 - 29,999', '30,000 - 39,999', '40,000 - 49,999', '50,000 - 59,999', '60,000 - 69,999', '70,000 - 79,999', '80,000 - 89,999', '90,000 - 99,999', '100,000 - 109,999', '110,000 - 119,999', '120,000 - 129,999', '130,000 - 139,999', '140,000+'))

tuition_data = mutate(tuition_data,
                      base_per_day = price / 5)

# max_tuition = data.frame(
#   days = c(1, 2, 3, 4, 5),
#   price = c(1, 1, 1, 1, 1600)
# )

tuition_data
ui <- fluidPage(
   
   # Application title
   titlePanel("Sudbury Tuition Calculator"),
   
   # Sidebar with a slider input for number of bins 
   sidebarLayout(
      sidebarPanel(
         selectInput("income",
                     "Net Income:",
                      choices = tuition_data$income_range),
         numericInput("days",
                      "Days Per Week:",
                      value = 5,
                      min = 1,
                      max = 5,
                      step = 1),
         numericInput("children",
                      "Children In Program:",
                      value = 1,
                      min = 1,
                      step = 1)
      ),
      
      # Show a plot of the generated distribution
      mainPanel(
         textOutput("tuition")
      )
   )
)

# Define server logic required to draw a histogram
server <- function(input, output) {
  calculate_tuition <- reactive({
    tuition_band = filter(tuition_data, income_range == input$income)
    
    tuition_per_year = tuition_band$base_per_day * input$days
    
    if (tuition_per_year > 8000) {
      tuition_per_year = 8000
    }
    
    tuition_per_year
  })
  
  output$tuition <- renderText({
    calculate_tuition()
    })
}

# Run the application 
shinyApp(ui = ui, server = server)

