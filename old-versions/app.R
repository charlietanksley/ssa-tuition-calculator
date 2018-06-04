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
library(shinythemes)
library(ggplot2)
library(forcats)

income_levels = factor(c(
  'Under 10,000',
  '10,000 - 14,999',
  '15,000 - 19,999',
  '20,000 - 24,999',
  '25,000 - 29,999',
  '30,000 - 34,999',
  '35,000 - 39,999',
  '40,000 - 44,999',
  '45,000 - 49,999',
  '50,000 - 54,999',
  '55,000 - 59,999',
  '60,000 - 64,999',
  '65,000 - 69,999',
  '70,000 - 74,999',
  '75,000 - 79,999',
  '80,000 - 84,999',
  '85,000 - 89,999',
  '90,000 - 94,999',
  '95,000 - 99,999',
  '100,000 - 104,999',
  '105,000 - 109,999',
  '110,000 - 114,999',
  '115,000 - 119,999',
  '120,000 - 124,999',
  '125,000 - 129,999',
  '130,000+'),
  levels = c(
    'Under 10,000',
    '10,000 - 14,999',
    '15,000 - 19,999',
    '20,000 - 24,999',
    '25,000 - 29,999',
    '30,000 - 34,999',
    '35,000 - 39,999',
    '40,000 - 44,999',
    '45,000 - 49,999',
    '50,000 - 54,999',
    '55,000 - 59,999',
    '60,000 - 64,999',
    '65,000 - 69,999',
    '70,000 - 74,999',
    '75,000 - 79,999',
    '80,000 - 84,999',
    '85,000 - 89,999',
    '90,000 - 94,999',
    '95,000 - 99,999',
    '100,000 - 104,999',
    '105,000 - 109,999',
    '110,000 - 114,999',
    '115,000 - 119,999',
    '120,000 - 124,999',
    '125,000 - 129,999',
    '130,000+'))


tuition_data = data.frame(
  price = c(180,
            270,
            360,
            540,
            720,
            990,
            1260,
            1620,
            1980,
            2430,
            2880,
            3420,
            3960,
            4590,
            5220,
            5940,
            6660,
            7470,
            8280,
            9180,
            10080,
            11070,
            12060,
            13140,
            14220,
            15110),
  income_range = income_levels
)

tuition_data = mutate(tuition_data,
                      base_per_day_4_year = (price * .688) / 5,
                      base_per_day = price / 5)

tuition_adjustment = data.frame(
  days = c(1, 2, 3, 4, 5),
  full_tuition = c(2000, 3840, 5520, 7040, 8000),
  percent_increase = c(1.25, 1.20, 1.15, 1.10, 1)
)

tuition_adjustment_4_year = data.frame(
  days = c(1, 2, 3, 4, 5),
  full_tuition = c(1540, 2860, 3960, 4840, 5500),
  percent_increase = c(1.40, 1.30, 1.20, 1.10, 1)
)


ui <- fluidPage(theme = shinytheme("journal"),

   # Application title
   titlePanel("Sudbury School of Atlanta Monthly Tuition Assistance Calculator"),

   # Sidebar with a slider input for number of bins
   sidebarLayout(
      sidebarPanel(
        h2('Enter Your information'),
         selectInput("income",
                     "Net Income:",
                      choices = tuition_data$income_range,
                     selected = '95,000 - 99,999'),
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
                      step = 1),
        radioButtons("program",
                     "Program:",
                     c("5+ Years Old (9am - 3pm)", "4 Years Old (9am - 1pm)"),
                     "5+ Years Old (9am - 3pm)")
      ),

      mainPanel(
        fluidRow(column(width = 6,
                        h2('Base tuition'),
                        p(textOutput('base_tuition_blurb')),
                        tags$div(style = 'font-size: 3em; color: green; text-align: center;',
                          p(textOutput('full.full_tuition')))),
                 column(width = 6, style = 'border-left: 1px solid gray',
                        h2('With tuition assistance'),
                        p(textOutput('tuition_assistance_blurb')),
                        tags$div(style = 'font-size: 3em; color: green; text-align: center;',
                          p(textOutput('full.tuition'))))

                 )

        # Show a plot of the generated distribution
        # , p(plotOutput('tuition_scale_plot'))
      )
   )
)


#Define server logic required to draw a histogram
server <- function(input, output) {
  # output$tuition_scale_plot <- renderPlot({
  #   ggplot(tuition_data, aes(x = income_range)) +
  #     geom_point(aes(y = base_per_day), color = 'blue') +
  #     geom_point(aes(y = base_per_day_4_year), color = 'green')
  # })

  data_sets <- function() {
    list(
      full_program = list(tuition_column = 'base_per_day',
                          adjustment = tuition_adjustment) ,
      four_year_program = list(tuition_column = 'base_per_day_4_year',
                               adjustment = tuition_adjustment_4_year)
    )
  }

  data_set <- reactive({
    if (input$program == "5+ Years Old (9am - 3pm)") {
      data_sets()$full_program
    } else {
      data_sets()$four_year_program
    }

  })

  tuition <- function() {
    tuition_row = filter(tuition_data, income_range == input$income)
    tuition_column = data_set()$tuition_column
    base_yearly_tuition = tuition_row[tuition_column] * adjustment()$percent_increase * input$days
    base_daily_tuition = base_yearly_tuition
    round(base_daily_tuition, 0)
  }

  adjustment <- function() {
    filter(data_set()$adjustment, days == input$days)
  }

  tuition_cap <- function() {
    adjustment()$full_tuition
  }

  single_tuition <- function() {
    tuition = tuition()
    cap = tuition_cap()

    if (tuition > cap) {
      return(cap)
    }

    tuition
  }

  additional_tuition <- function() {
    tuition = tuition() / 2
    cap = tuition_cap()
    if (tuition > cap) {
      return(cap)
    }
    tuition
  }

  calculate_tuition <- reactive({
    total_tuition = single_tuition()
    if (input$children > 1) {
      for (i in 2:input$children) {
        total_tuition = total_tuition + additional_tuition()
      }

      cap = tuition_cap()
      if (total_tuition == cap * input$children) {
        discount = cap * .1
        for (i in 2:input$children) {
          total_tuition = total_tuition - discount
        }
      }
    }
    paste0('$', round(total_tuition / 10))
  })

  base_tuition <- reactive({
    total_tuition =  0
    for (i in 1:input$children) {
      total_tuition = total_tuition + adjustment()$full_tuition
    }

    paste0('$', total_tuition / 10)
  })

  kids <- reactive({
    if (input$children > 1) {
      return(' children')
    } else {
      return(' child')
    }
  })

  output$base_tuition_blurb <- renderText({
    paste0('For ', input$children, kids(), ' attending Sudbury School of Atlanta ', input$days, ' days a week, base monthly tuition is')
  })

  output$tuition_assistance_blurb <- renderText({
    paste0('For ', input$children, kids(), ' attending Sudbury School of Atlanta ', input$days, ' days a week, YOUR monthly tuition is')
  })

  output$full.full_tuition <- renderText({
    base_tuition()
  })

  output$full.tuition <- renderText({
    calculate_tuition()
  })
}

# Run the application
shinyApp(ui = ui, server = server)
