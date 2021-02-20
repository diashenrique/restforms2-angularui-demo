Class dc.irisrad.rest.Main Extends Form.REST.Main
{

XData UrlMap [ XMLNamespace = "http://www.intersystems.com/urlmap" ]
{
<Routes>
<Route Url="/form" Method="POST" Call="CreateForm"/>
<Route Url="/form/:form" Method="DELETE" Call="DeleteForm"/>
<Route Url="/form/object/:form/:id" Method="PUT" Call="updateFormDynamicObject"/>
<Route Url="/form/object/:form/:id" Method="DELETE" Call="deleteFormObject"/>
<Map Prefix="/form" Forward="Form.REST.Form"/>

<Route Url="/logout" Method="GET" Call="logout"/>
<Route Url="/test" Method="GET" Call="test"/>
<Route Url="/test" Method="POST" Call="test"/>
<Route Url="/info" Method="GET" Call="info"/>
</Routes>
}

ClassMethod updateFormDynamicObject(form, id) As %Status
{
  $$$TOE(sc, ##class(Form.REST.Object).updateFormDynamicObject(form, id))
  /// ugly hack for jQuery Ajax error
  Write 1
  Return sc
}

ClassMethod deleteFormObject(form, id) As %Status
{
  $$$TOE(sc, ##class(Form.REST.Object).deleteFormObject(form, id))
  /// ugly hack for jQuery Ajax error
  Write 1
  Return sc
}

ClassMethod CreateForm() As %Status
{
  Set sc = $$$OK
  Try {
    Set body = {}.%FromJSON(%request.Content)
    Set form = ##class(dc.irisrad.Form).%New()
    Set form.Name = body.name
    Set form.DisplayField = body.displayProperty
    Set form.Fields = body.fields
    $$$TOE(sc, form.Save())
  }
  Catch ex {
    Set sc = ex.AsStatus()
  }
  Return sc
}

ClassMethod DeleteForm(pFormName As %String) As %Status
{
  Set sc = $$$OK
  Try {
    $$$TOE(sc, ##class(%Dictionary.ClassDefinition).%DeleteId(pFormName))
  }
  Catch ex {
    Set sc = ex.AsStatus()
  }
  Return sc
}

/// Logout user from current session
ClassMethod logout() As %Status
{
    Return ##class(Form.REST.Main).logout()
}

/// Test method
ClassMethod test() As %Status
{
    Do ##class(Form.REST.Main).test()
    Return $$$OK
}

/// Language info
ClassMethod info() As %Status
{
	Do ##class(Form.REST.Main).info()
	Return $$$OK
}

}
