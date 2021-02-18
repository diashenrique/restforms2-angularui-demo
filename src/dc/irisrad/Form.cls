Class dc.irisrad.Form Extends %RegisteredObject
{

Property Form As %Persistent;

Property Name As %String [ Required ];

Property DisplayField As %String [ Required ];

Property Fields As %DynamicArray [ Required ];

Method Save() As %Status
{
  Set sc = $$$OK
  Try {
    // form config validation
    $$$TOE(sc, ..%ValidateObject())

    // form creation
    Set ..Form = ..CreateFormClass()
    
    // form parameters
    Do ..SetParameters([{
      "name": "FORMNAME",
      "value": "FormTest"
    },{
      "name": "OBJPERMISSIONS",
      "value": "CRUD"
    },{
      "name": "DISPLAYPROPERTY",
      "value": (..DisplayField)
    }])

    // form persistencing
    $$$TOE(sc, ..Form.%Save())
    
    // form fields persistencing
    Set propIter = ..Fields.%GetIterator()
    While (propIter.%GetNext(.propIdx, .propDef)) {
      Set class = ..Name
      Set name = propDef.name
      Set type = propDef.type
      Set collection = ..GetProperty(propDef, "collection", "")
      Set displayName = ..GetProperty(propDef, "displayName", "")
      Set required = ..GetProperty(propDef, "required", 0)
      Set jsonInclude = ..GetProperty(propDef, "jsonInclude", "INOUT")
      Set jsonReference = ..GetProperty(propDef, "jsonReference", "ID")
      $$$TOE(sc, ##class(Form.Property).addClassProperty(class, name, type, collection, displayName, required, jsonInclude, jsonReference))
    }

    // form compiling
    $$$TOE(sc, $SYSTEM.OBJ.Compile(..Name, "-d"))
  }
  Catch ex {
    Set sc = ex.AsStatus()
  }
  Return sc
}

Method GetProperty(pDynObj As %DynamicObject, pPropName As %String, pDefault = "")
{
  If (pDynObj.%IsDefined(pPropName)) {
    Return pDynObj.%Get(pPropName)
  }
  Return pDefault
}

Method CreateFormClass() As %Persistent
{
  Set className = ..Name
  Set classObj = ##class(%Dictionary.ClassDefinition).%OpenId(className)
  If ('$ISOBJECT(classObj)) {
    Set classObj = ##class(%Dictionary.ClassDefinition).%New()
  }
  Set classObj.Name = className
  Set classObj.Super = "%Persistent, Form.Adaptor"
  Return classObj
}

Method SetParameters(pParametersDef As %DynamicArray)
{
  Set it = pParametersDef.%GetIterator()
  While(it.%GetNext(.idx, .parameterDef)) {
    Do ..SetParameter(parameterDef)
  }
}

Method SetParameter(pParameterDef As %DynamicObject)
{
  Set parameterName = pParameterDef.name
  Set paramObj = ##class(%Dictionary.ParameterDefinition).%New()
  Set paramObj.Name = parameterName
  Set paramObj.parent = ..Form
  Set paramObj.Default = pParameterDef.value
}

}
